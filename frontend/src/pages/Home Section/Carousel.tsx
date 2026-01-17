import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GradientText, ScrollRevealText } from '@/components/textAnimations';

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  const cardsData = [
    {
      title: "Dubai",
      desc: "Experience the blend of modernity and tradition in Dubai, from towering skyscrapers to historic markets.",
      bg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
      thumb: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=987&auto=format&fit=crop",
      path: "/destinations/dubai",
    },
    {
      title: "Turkey",
      desc: "Discover Turkey's rich history and diverse landscapes, from ancient ruins to bustling bazaars.",
      bg: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop",
      thumb: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=987&auto=format&fit=crop",
      path: "/destinations/turkey",
    },
    {
      title: "Greece",
      desc: "Explore Greece's ancient heritage and stunning islands, where history meets breathtaking scenery.",
      bg: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2070&auto=format&fit=crop",
      thumb: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=987&auto=format&fit=crop",
      path: "/destinations/greece",
    },
    {
      title: "Thailand",
      desc: "Immerse yourself in Thailand's vibrant culture, delicious cuisine, and tropical paradises.",
      bg: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2139&auto=format&fit=crop",
      thumb: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=987&auto=format&fit=crop",
      path: "/destinations/thailand",
    },
    {
      title: "Indonesia",
      desc: "Uncover Indonesia's diverse archipelago, offering a tapestry of cultures, landscapes, and adventures.",
      bg: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2138&auto=format&fit=crop",
      thumb: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=987&auto=format&fit=crop",
      path: "/destinations/indonesia",
    },
  ];

  const isMobile = () => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width:767px)").matches;
    }
    return false;
  };

  const center = (i: number) => {
    if (!trackRef.current || !sliderRef.current) return;

    const cards = Array.from(trackRef.current.children) as HTMLElement[];
    const card = cards[i];
    if (!card) return;

    const axis = isMobile() ? "top" : "left";
    const size = isMobile() ? "clientHeight" : "clientWidth";
    const start = isMobile() ? card.offsetTop : card.offsetLeft;

    const wrapSize = sliderRef.current[size] as number;
    const cardSize = card[size] as number;

    sliderRef.current.scrollTo({
      [axis]: start - (wrapSize / 2 - cardSize / 2),
      behavior: "smooth",
    });
  };

  const activate = (i: number, scroll: boolean) => {
    if (i === current) return;
    setCurrent(i);
    if (scroll) {
      setTimeout(() => center(i), 0);
    }
  };

  const go = (step: number) => {
    const newIndex = Math.min(
      Math.max(current + step, 0),
      cardsData.length - 1
    );
    activate(newIndex, true);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1);
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1);
    };

    const handleResize = () => center(current);

    window.addEventListener("keydown", handleKeydown, { passive: true } as any);
    window.addEventListener("resize", handleResize);

    // Initial center
    setTimeout(() => center(current), 100);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("resize", handleResize);
    };
  }, [current, isMounted]);

  const handleCardMouseEnter = (i: number) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover:hover)").matches
    ) {
      activate(i, true);
    }
  };

  const handleCardClick = (i: number) => {
    activate(i, true);
  };

  const handleTouchStart = useRef({ x: 0, y: 0 });

  const onTouchStart = (e: React.TouchEvent) => {
    handleTouchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - handleTouchStart.current.x;
    const dy = e.changedTouches[0].clientY - handleTouchStart.current.y;
    if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60) {
      go((isMobile() ? dy : dx) > 0 ? -1 : 1);
    }
  };

  return (
    <div className="carousel-container">
      <section>
        <div className="">
          <ScrollRevealText tag="h2" direction="up" duration={0.8} className="leading-[1.4] mb-6 text-center max-md:max-w-[22rem] max-md:mx-auto">
            <GradientText
              tag="span"
              className="text-3xl md:text-4xl font-light"
            >
              Discover Your Next Adventure
            </GradientText>
          </ScrollRevealText>
        </div>

        <div className="slider" ref={sliderRef}>
          <div
            className="track"
            ref={trackRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {cardsData.map((card, index) => (
              <article
                key={index}
                className="project-card"
                data-active={current === index}
                onMouseEnter={() => handleCardMouseEnter(index)}
                onClick={() => handleCardClick(index)}
              >
                <img
                  className="project-card__bg"
                  src={card.bg}
                  alt={card.title}
                />
                <div className="project-card__content">
                  {card.thumb && (
                    <img
                      className="project-card__thumb"
                      src={card.thumb}
                      alt={card.title}
                    />
                  )}
                  <div>
                    <h3 className="project-card__title">{card.title}</h3>
                    <p className="project-card__desc">{card.desc}</p>
                    <button
                      className="project-card__btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(card.path);
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {!isMobile() && (
          <div className="dots">
            {cardsData.map((_, index) => (
              <span
                key={index}
                className={`dot ${current === index ? "active" : "!bg-red-300"
                  }`}
                onClick={() => activate(index, true)}
              />
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .carousel-container {
          --gap: 1.25rem;
          --speed: 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          --closed: 5rem; /* Width when collapsed - SHOWING COUNTRY NAME */
          --open: 35rem; /* Reduced from 60rem to show more cards */
          --accent: #915b05;
        }

        .slider {
          max-width: 1400px;
          margin: auto;
          overflow: hidden;
          padding: 0 20px;
        }

        .track {
          display: flex;
          gap: var(--gap);
          align-items: flex-start;
          justify-content: center;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          padding-bottom: 40px;
          width: max-content;
          min-width: 100%;
          margin: 0 auto;
        }

        .track::-webkit-scrollbar {
          display: none;
        }

        .project-card {
          position: relative;
          flex: 0 0 var(--closed);
          height: 26rem;
          border-radius: 1rem;
          overflow: hidden;
          cursor: pointer;
          transition: flex-basis var(--speed), transform var(--speed);
          scroll-snap-align: center;
        }

        .project-card[data-active="true"] {
          flex-basis: var(--open);
          transform: translateY(-6px);
        }

        .project-card__bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.75) saturate(75%);
          transition: filter 0.3s, transform var(--speed);
        }

        .project-card:hover .project-card__bg {
          filter: brightness(0.9) saturate(100%);
          transform: scale(1.06);
        }

        .project-card__content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 0.7rem;
          padding: 0;
          background: linear-gradient(
            transparent 40%,
            rgba(0, 0, 0, 0.85) 100%
          );
          z-index: 2;
        }

        /* IDLE STATE - Country name shown vertically */
        .project-card__title {
          color: #fff;
          font-weight: 700;
          font-size: 1.35rem;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
          letter-spacing: 2px;
        }

        .project-card__thumb,
        .project-card__desc,
        .project-card__btn {
          display: none;
        }

        /* ACTIVE STATE */
        .project-card[data-active="true"] .project-card__content {
          flex-direction: row;
          align-items: center;
          padding: 1.2rem 2rem;
          gap: 1.1rem;
        }

        .project-card[data-active="true"] .project-card__title {
          writing-mode: horizontal-tb;
          transform: none;
          font-size: 2.4rem;
          margin-bottom: 0.5rem;
        }

        .project-card[data-active="true"] .project-card__thumb,
        .project-card[data-active="true"] .project-card__desc,
        .project-card[data-active="true"] .project-card__btn {
          display: block;
        }

        .project-card__thumb {
          width: 133px;
          height: 269px;
          border-radius: 0.45rem;
          object-fit: cover;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        }

        .project-card__desc {
          color: #ddd;
          font-size: 1rem;
          line-height: 1.4;
          max-width: 16rem;
        }

        .project-card__btn {
          padding: 0.55rem 1.3rem;
          border: none;
          border-radius: 9999px;
          background: var(--accent);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background 0.3s;
        }

        .project-card__btn:hover {
          background: #7c4e04;
        }

        .dots {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          padding: 20px 0;
        }

        .dot {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.35);
          cursor: pointer;
          transition: 0.3s;
        }

        .dot.active {
          background: var(--accent);
          transform: scale(1.2);
        }

        /* Responsive adjustments for showing more cards */
        @media (min-width: 1800px) {
          .carousel-container {
            --open: 40rem;
          }
        }

        @media (min-width: 1600px) and (max-width: 1799px) {
          .carousel-container {
            --open: 38rem;
          }
        }

        @media (min-width: 1400px) and (max-width: 1599px) {
          .carousel-container {
            --open: 35rem;
          }
        }

        @media (min-width: 1200px) and (max-width: 1399px) {
          .carousel-container {
            --open: 32rem;
          }
        }

        @media (min-width: 1024px) and (max-width: 1199px) {
          .carousel-container {
            --open: 30rem;
          }
          
          .project-card__thumb {
            width: 120px;
            height: 240px;
          }
          
          .project-card[data-active="true"] .project-card__title {
            font-size: 2.2rem;
          }
        }

        @media (min-width: 900px) and (max-width: 1023px) {
          .carousel-container {
            --open: 28rem;
            --closed: 4.5rem;
          }
          
          .project-card {
            height: 24rem;
          }
          
          .project-card__thumb {
            width: 110px;
            height: 220px;
          }
          
          .project-card[data-active="true"] .project-card__title {
            font-size: 2rem;
          }
          
          .project-card__desc {
            font-size: 0.95rem;
            max-width: 14rem;
          }
        }

        @media (min-width: 768px) and (max-width: 899px) {
          .carousel-container {
            --open: 25rem;
            --closed: 4rem;
            --gap: 1rem;
          }
          
          .track {
            padding-bottom: 30px;
          }
          
          .project-card {
            height: 22rem;
          }
          
          .project-card__thumb {
            width: 100px;
            height: 200px;
          }
          
          .project-card[data-active="true"] .project-card__title {
            font-size: 1.8rem;
          }
          
          .project-card__desc {
            font-size: 0.9rem;
            max-width: 12rem;
          }
          
          .project-card__btn {
            padding: 0.5rem 1.2rem;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 767px) {
          .carousel-container {
            --closed: 100%;
            --open: 100%;
            --gap: 0.8rem;
          }

          .slider {
            padding: 0 15px;
          }

          .track {
            flex-direction: column;
            scroll-snap-type: y mandatory;
            gap: 0.8rem;
            padding-bottom: 20px;
            width: 100%;
          }

          .project-card {
            height: auto;
            min-height: 80px;
            flex: 0 0 auto;
            width: 100%;
            scroll-snap-align: start;
          }

          .project-card[data-active="true"] {
            min-height: 300px;
            transform: none;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          }

          .project-card__content {
            flex-direction: row;
            justify-content: flex-start;
            padding: 1rem;
            align-items: center;
            gap: 1rem;
          }

          .project-card__title {
            writing-mode: horizontal-tb;
            transform: none;
            font-size: 1.2rem;
            margin-right: auto;
          }

          .project-card__thumb,
          .project-card__desc,
          .project-card__btn {
            display: none;
          }

          .project-card[data-active="true"] .project-card__content {
            align-items: flex-start;
            padding: 1.5rem;
          }

          .project-card[data-active="true"] .project-card__title {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            margin-top: 2rem;
          }

          .project-card[data-active="true"] .project-card__thumb {
            width: 200px;
            height: 267px;
            border-radius: 0.35rem;
            margin-bottom: 1rem;
            display: block;
          }

          .project-card[data-active="true"] .project-card__desc {
            font-size: 0.95rem;
            max-width: 100%;
            margin-bottom: 1rem;
            display: block;
          }

          .project-card[data-active="true"] .project-card__btn {
            align-self: center;
            width: 100%;
            text-align: center;
            padding: 0.7rem;
            display: block;
          }

          .dots {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .project-card[data-active="true"] {
            min-height: 350px;
          }
          
          .project-card[data-active="true"] .project-card__thumb {
            width: 180px;
            height: 240px;
          }
          
          .project-card[data-active="true"] .project-card__title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Carousel;