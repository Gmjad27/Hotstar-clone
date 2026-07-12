import React from 'react';
import useInView from '../../hooks/useInView';

/**
 * One horizontal row of cards, Netflix-style.
 *
 * Responsive behavior (this is the part that makes rails feel genuinely
 * different per device instead of just "the same layout, scaled"):
 *  - Mobile / touch (< md): no arrow buttons — they don't make sense for a
 *    swipe interface and were dead weight being measured/repainted on every
 *    scroll tick. Native `scroll-snap` gives a crisp, GPU-accelerated swipe.
 *  - Desktop (>= md): hover-revealed arrows like the original, snap scroll
 *    is kept as a progressive enhancement (smooth even without JS).
 *  - Row padding / heading size / gap scale up across sm → md → lg → xl so
 *    density and whitespace both feel intentional on a phone vs. a 27" monitor.
 *
 * Perf: the row's contents aren't mounted until they're ~400px from the
 * viewport (see useInView), so a page with 6-7 rails of 20 cards each
 * doesn't force-decode ~140 images on first paint.
 */
export default function RailRow({
    title,
    railKey,
    items,
    scrollState,
    setTrackRef,
    onRailScroll,
    handleRailScroll,
    renderItem,
    eager = false,
}) {
    const [sectionRef, inView] = useInView('500px 0px');
    const shouldRender = eager || inView;
    const state = (scrollState && scrollState[railKey]) || {};

    return (
        <section ref={sectionRef} className="space-y-2 sm:space-y-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold pl-1">{title}</h2>
            <div className="relative group">
                {/* Left arrow — desktop/hover only, hidden on touch devices */}
                <button
                    type="button"
                    className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 lg:w-10 lg:h-10 items-center justify-center rounded-full bg-black/60 text-white text-xl backdrop-blur-sm hover:bg-black/90 transition-opacity duration-200 ${!state.canScroll || state.atStart ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'
                        }`}
                    aria-label={`Scroll ${title} left`}
                    onClick={() => handleRailScroll(railKey, -1)}
                >
                    ‹
                </button>

                {shouldRender ? (
                    <div
                        ref={setTrackRef(railKey)}
                        onScroll={() => onRailScroll(railKey)}
                        className="flex gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory md:snap-none scroll-smooth pb-3 sm:pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {items.map((item, idx) => (
                            <div className="snap-start flex-shrink-0" key={item.id ?? idx}>
                                {renderItem(item, idx)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-2 sm:gap-3 pb-3 sm:pb-4 overflow-hidden" aria-hidden="true">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 w-[38vw] sm:w-[26vw] md:w-[180px] lg:w-[200px] aspect-[2/3] rounded-md bg-white/5 animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {/* Right arrow — desktop/hover only */}
                <button
                    type="button"
                    className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 lg:w-10 lg:h-10 items-center justify-center rounded-full bg-black/60 text-white text-xl backdrop-blur-sm hover:bg-black/90 transition-opacity duration-200 ${!state.canScroll || state.atEnd ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'
                        }`}
                    aria-label={`Scroll ${title} right`}
                    onClick={() => handleRailScroll(railKey, 1)}
                >
                    ›
                </button>
            </div>
        </section>
    );
}