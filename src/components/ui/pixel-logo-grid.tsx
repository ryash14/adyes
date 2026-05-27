"use client";

import { cn } from "../../utils/cn";
import { useCallback, useEffect, useRef } from "react";

/* -----------------------------------------------------------------------------
 * Pixel canvas
 * Animated grid of pixels that ripples in from the center on hover and fades
 * out on leave. Colors are drawn from the card's brand palette.
 * -------------------------------------------------------------------------- */

type Pixel = {
  x: number;
  y: number;
  color: string;
  ctx: CanvasRenderingContext2D;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInt: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;
  draw: () => void;
  appear: () => void;
  disappear: () => void;
  shimmer: () => void;
};

function createPixel(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  color: string,
  baseSpeed: number,
  delay: number
): Pixel {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const p: Pixel = {
    x, y, color, ctx,
    speed: rand(0.1, 0.9) * baseSpeed,
    size: 0,
    sizeStep: Math.random() * 0.4,
    minSize: 0.5,
    maxSizeInt: 2,
    maxSize: rand(0.5, 2),
    delay,
    counter: 0,
    counterStep: Math.random() * 4 + (canvas.width + canvas.height) * 0.01,
    isIdle: false,
    isReverse: false,
    isShimmer: false,
    draw() {
      const offset = p.maxSizeInt * 0.5 - p.size * 0.5;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
    },
    appear() {
      p.isIdle = false;
      if (p.counter <= p.delay) {
        p.counter += p.counterStep;
        return;
      }
      if (p.size >= p.maxSize) p.isShimmer = true;
      if (p.isShimmer) p.shimmer();
      else p.size += p.sizeStep;
      p.draw();
    },
    disappear() {
      p.isShimmer = false;
      p.counter = 0;
      if (p.size <= 0) {
        p.isIdle = true;
        return;
      }
      p.size -= 0.1;
      p.draw();
    },
    shimmer() {
      if (p.size >= p.maxSize) p.isReverse = true;
      else if (p.size <= p.minSize) p.isReverse = false;
      if (p.isReverse) p.size -= p.speed;
      else p.size += p.speed;
    },
  };

  return p;
}

type PixelCanvasProps = {
  colors: string[];
  gap?: number;
  speed?: number;
};

export function PixelCanvas({ colors, gap = 5, speed = 30 }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef(performance.now());
  const reducedMotionRef = useRef(false);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width);
    const h = Math.floor(height);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const effectiveSpeed = reducedMotionRef.current ? 0 : Math.min(speed, 100) * 0.001;
    const pixels: Pixel[] = [];

    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = reducedMotionRef.current ? 0 : Math.sqrt(dx * dx + dy * dy);
        pixels.push(createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay));
      }
    }

    pixelsRef.current = pixels;
  }, [colors, gap, speed]);

  const animate = useCallback((mode: "appear" | "disappear") => {
    cancelAnimationFrame(animationRef.current);
    const frameInterval = 1000 / 60;

    const loop = () => {
      animationRef.current = requestAnimationFrame(loop);

      const now = performance.now();
      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pixels = pixelsRef.current;
      for (const pixel of pixels) pixel[mode]();

      if (pixels.every((p) => p.isIdle)) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    init();

    const resizeObserver = new ResizeObserver(() => init());
    if (wrapRef.current) resizeObserver.observe(wrapRef.current);

    const card = wrapRef.current?.parentElement;
    const handleEnter = () => animate("appear");
    const handleLeave = () => animate("disappear");
    card?.addEventListener("mouseenter", handleEnter);
    card?.addEventListener("mouseleave", handleLeave);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
      card?.removeEventListener("mouseenter", handleEnter);
      card?.removeEventListener("mouseleave", handleLeave);
    };
  }, [init, animate]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * Logo SVGs
 * -------------------------------------------------------------------------- */

type LogoSvgProps = { className?: string; style?: React.CSSProperties };

export function SlackLogo({ className, style }: LogoSvgProps) {
  return (
    <svg viewBox="0 0 101 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M35.2833 21.8153L36.262 19.5277C37.3337 20.3213 38.7315 20.7414 40.1295 20.7414C41.1547 20.7414 41.807 20.3447 41.807 19.7379C41.7836 18.0571 35.6328 19.3643 35.586 15.1385C35.5626 12.9909 37.4733 11.3335 40.1763 11.3335C41.7836 11.3335 43.3916 11.7305 44.533 12.6411L43.6185 14.9775C42.5682 14.3022 41.271 13.8313 40.0364 13.8313C39.1976 13.8313 38.6382 14.228 38.6382 14.7419C38.6616 16.3993 44.8595 15.4888 44.9294 19.5277C44.9294 21.7221 43.0651 23.2629 40.4089 23.2629C38.452 23.2629 36.6584 22.7961 35.2833 21.8153ZM74.2553 18.6993C74.0082 19.1383 73.6488 19.5036 73.214 19.7579C72.7791 20.0121 72.2846 20.1461 71.7808 20.1462C70.211 20.1462 68.9385 18.8711 68.9385 17.2982C68.9385 15.7253 70.211 14.4502 71.7808 14.4502C72.2846 14.4502 72.7791 14.5843 73.214 14.8385C73.6488 15.0927 74.0082 15.4581 74.2553 15.8971L76.9763 14.3867C75.9571 12.5652 74.013 11.3335 71.7808 11.3335C68.4931 11.3335 65.8279 14.0037 65.8279 17.2982C65.8279 20.5923 68.4931 23.2629 71.7808 23.2629C74.013 23.2629 75.9571 22.0312 76.9763 20.2097L74.2553 18.6993ZM46.6951 23.0293H50.0967V6.36829H46.6954L46.6951 23.0293ZM78.6942 6.36829V23.0293H82.0959V18.0377L86.1268 23.0293H90.475L85.3489 17.0994L90.102 11.5661H85.9404L82.0959 16.1664V6.36829H78.6942ZM60.5769 11.5668V12.9211C60.0179 11.9871 58.6431 11.3335 57.1986 11.3335C54.2162 11.3335 51.8631 13.9717 51.8631 17.2865C51.8631 20.6013 54.2162 23.2629 57.1986 23.2629C58.6431 23.2629 60.0179 22.6092 60.5769 21.6753V23.0293H63.9786V11.5668H60.5769ZM60.5769 18.7224C60.0877 19.5394 59.0625 20.1459 57.921 20.1459C56.3508 20.1459 55.0784 18.8711 55.0784 17.2982C55.0784 15.7253 56.3508 14.4502 57.921 14.4502C59.0625 14.4502 60.0877 15.0804 60.5769 15.9205V18.7224Z" fill="black"/>
      <path d="M17.3187 6C16.2163 6 15.3228 6.89554 15.3228 7.99993C15.3225 8.26229 15.3739 8.52215 15.4741 8.76465C15.5743 9.00715 15.7212 9.22754 15.9065 9.41326C16.0919 9.59897 16.312 9.74636 16.5543 9.847C16.7966 9.94765 17.0563 9.99959 17.3187 9.99985H19.3149V7.99993C19.3154 7.47001 19.1053 6.96163 18.7309 6.58657C18.3566 6.21153 17.8486 6.00053 17.3187 6ZM17.3187 11.3331H11.9959C10.8935 11.3331 10 12.2287 10 13.3334C10 14.4378 10.8935 15.3333 11.9959 15.3333H17.319C18.4211 15.3333 19.3149 14.4378 19.3149 13.3334C19.3149 12.2287 18.4211 11.3331 17.3187 11.3331Z" fill="#2FBDEE"/>
      <path d="M29.9605 13.3334C29.9605 12.2287 29.0666 11.3331 27.9642 11.3331C26.8618 11.3331 25.9683 12.2287 25.9683 13.3334V15.3333H27.9642C28.4942 15.3328 29.0021 15.1218 29.3765 14.7468C29.7509 14.3717 29.9609 13.8633 29.9605 13.3334ZM24.6377 13.3334V7.99993C24.6381 7.47001 24.4281 6.96163 24.0537 6.58657C23.6793 6.21153 23.1714 6.00053 22.6414 6C21.539 6 20.6456 6.89554 20.6456 7.99993V13.3331C20.6456 14.4381 21.539 15.3337 22.6414 15.3337C23.1714 15.3331 23.6793 15.1221 24.0537 14.7471C24.4281 14.372 24.6381 13.8633 24.6377 13.3334Z" fill="#29AD72"/>
      <path d="M22.6414 26C23.1714 25.9995 23.6793 25.7885 24.0537 25.4134C24.4281 25.0384 24.6381 24.53 24.6377 24.0001C24.6381 23.4702 24.4281 22.9618 24.0537 22.5867C23.6793 22.2117 23.1714 22.0007 22.6414 22.0002H20.6456V24.0001C20.6456 25.1045 21.539 26 22.6414 26ZM22.6414 20.6669H27.9645C29.0666 20.6669 29.9605 19.7714 29.9605 18.6667C29.9609 18.1367 29.7509 17.6283 29.3765 17.2533C29.0021 16.8783 28.4942 16.6673 27.9642 16.6667H22.6414C21.539 16.6667 20.6456 17.5623 20.6456 18.6667C20.6452 18.929 20.6967 19.1888 20.7969 19.4313C20.897 19.6739 21.044 19.8942 21.2293 20.08C21.4146 20.2656 21.6347 20.413 21.8771 20.5137C22.1193 20.6143 22.3791 20.6666 22.6414 20.6669Z" fill="#E9A929"/>
      <path d="M10 18.6667C9.99974 18.929 10.0512 19.1888 10.1513 19.4313C10.2515 19.6739 10.3984 19.8942 10.5838 20.08C10.7691 20.2656 10.9892 20.413 11.2315 20.5137C11.4738 20.6143 11.7335 20.6663 11.9959 20.6665C12.5258 20.666 13.0338 20.455 13.4082 20.08C13.7825 19.7049 13.9926 19.1965 13.9922 18.6667V16.6667H11.9959C10.8935 16.6667 10 17.5623 10 18.6667ZM15.3228 18.6667V23.9998C15.3228 25.1045 16.2163 26 17.3187 26C17.8486 25.9995 18.3566 25.7885 18.7309 25.4134C19.1053 25.0384 19.3154 24.53 19.3149 24.0001V18.6667C19.3152 18.4043 19.2638 18.1443 19.1636 17.9018C19.0634 17.6593 18.9164 17.4389 18.7311 17.2532C18.5457 17.0674 18.3255 16.9201 18.0832 16.8195C17.8409 16.7188 17.5811 16.6669 17.3187 16.6667C16.2163 16.6667 15.3228 17.5623 15.3228 18.6667Z" fill="#DC1C50"/>
    </svg>
  );
}

// NOTE: Since the prompt was truncated, additional SVGs like StripeLogo, 
// MediumLogo, GoogleLogo, NetflixLogo etc. can be added below following the same pattern.
