import React, { useState } from 'react';
import { ArrowLeft, Apple, PersonStanding, Monitor, Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ... (existing code)

// Sub-component for "Human Double Mirror View"
const HumanDoubleMirrorView: React.FC = () => {
    // Coordinate system: viewBox="0 0 800 600"
    // Mirror 1 (Top): Y=300, X=150~400
    // Mirror 2 (Right): X=400, Y=300~550
    // Origin of mirrors: (400, 300)

    // Observer (Real Person)
    const eyePos = { x: 200, y: 500 };
    // Hands (Stretched out)
    // Right Hand (Red Apple): (240, 540)
    const rightHandPos = { x: 240, y: 540 };
    // Left Hand: (160, 460)
    const leftHandPos = { x: 160, y: 460 };

    // Toggles
    const [showTopImage, setShowTopImage] = useState(false);      // "左側の鏡" (Top Mirror)
    const [showRightImage, setShowRightImage] = useState(false);  // "右側の鏡" (Right Mirror)
    const [showCenterImage, setShowCenterImage] = useState(false); // "奥の鏡" (Center/Diagonal)



    // Helper to reflect a point
    const reflectPoint = (p: { x: number, y: number }, axis: 'x' | 'y', val: number) => {
        if (axis === 'y') return { x: p.x, y: val - (p.y - val) };
        return { x: val - (p.x - val), y: p.y };
    };

    // Calculate Virtual Images (Head, Hands)
    // 1. Top Mirror (Reflect Y=300)
    const v1_head = reflectPoint(eyePos, 'y', 300);
    const v1_right = reflectPoint(rightHandPos, 'y', 300);
    const v1_left = reflectPoint(leftHandPos, 'y', 300);

    // 2. Right Mirror (Reflect X=400)
    const v2_head = reflectPoint(eyePos, 'x', 400);
    const v2_right = reflectPoint(rightHandPos, 'x', 400);
    const v2_left = reflectPoint(leftHandPos, 'x', 400);

    // 3. Center (Reflect Both)
    const v3_head = reflectPoint(v1_head, 'x', 400);
    const v3_right = reflectPoint(v1_right, 'x', 400);
    const v3_left = reflectPoint(v1_left, 'x', 400);


    // Calculate Ray Intersections (for Apple / Right Hand)
    const calculateIntersection = (source: { x: number, y: number }, target: { x: number, y: number }, mirrorAxis: 'x' | 'y', mirrorPos: number) => {
        // Line from Target to Source's Virtual Image
        // Virtual Image of Source
        const vSource = reflectPoint(source, mirrorAxis, mirrorPos);

        // Intersection of Line(Target -> vSource) with Mirror
        if (mirrorAxis === 'y') {
            const t = (mirrorPos - target.y) / (vSource.y - target.y);
            return { x: target.x + t * (vSource.x - target.x), y: mirrorPos };
        } else {
            const t = (mirrorPos - target.x) / (vSource.x - target.x);
            return { x: mirrorPos, y: target.y + t * (vSource.y - target.y) };
        }
    };

    // Rays for Top Image (Apple -> Top Mirror -> Eye)
    const topIntersection = calculateIntersection(rightHandPos, eyePos, 'y', 300);

    // Rays for Right Image (Apple -> Right Mirror -> Eye)
    const rightIntersection = calculateIntersection(rightHandPos, eyePos, 'x', 400);

    // Rays for Center Image (Double Reflection)
    // Trace back from Eye to v3_right (Virtual Apple 3)
    const t_right = (400 - eyePos.x) / (v3_right.x - eyePos.x);
    const y_at_right = eyePos.y + t_right * (v3_right.y - eyePos.y);
    const hitRightFirst = y_at_right > 300;

    let center_p1, center_p2;
    if (hitRightFirst) {
        // Path: Object -> Top -> Right -> Eye
        center_p1 = { x: 400, y: y_at_right }; // Hit Right Mirror
        // P2: Intersection of (P1 -> v1_right) with Top Mirror
        const t2 = (300 - center_p1.y) / (v1_right.y - center_p1.y);
        center_p2 = { x: center_p1.x + t2 * (v1_right.x - center_p1.x), y: 300 };
    } else {
        // Path: Object -> Right -> Top -> Eye
        const t_top = (300 - eyePos.y) / (v3_right.y - eyePos.y);
        const x_at_top = eyePos.x + t_top * (v3_right.x - eyePos.x);
        center_p1 = { x: x_at_top, y: 300 }; // Hit Top Mirror
        // P2: Intersection of (P1 -> v2_right) with Right Mirror
        const t2 = (400 - center_p1.x) / (v2_right.x - center_p1.x);
        center_p2 = { x: 400, y: center_p1.y + t2 * (v2_right.y - center_p1.y) };
    }

    return (
        <div className="flex flex-row h-full gap-4">
            {/* Left Panel: Front Views */}
            <div className="w-40 shrink-0 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        鏡の中
                    </h3>

                    <div className="flex flex-col gap-4 flex-1">
                        {/* Top Mirror View */}
                        <div className={`flex-1 border rounded-xl p-2 relative flex items-center justify-center bg-slate-50 transition-all ${showTopImage ? 'opacity-100 border-indigo-200 ring-2 ring-indigo-100' : 'opacity-40 grayscale'}`}>
                            <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-500">左の像</span>
                            {showTopImage && (
                                <div className="relative">
                                    <PersonStanding size={80} className="text-slate-800" />
                                    <Apple size={24} className="absolute top-4 -right-2 text-red-500 fill-current" />
                                </div>
                            )}
                        </div>

                        {/* Right Mirror View */}
                        <div className={`flex-1 border rounded-xl p-2 relative flex items-center justify-center bg-slate-50 transition-all ${showRightImage ? 'opacity-100 border-indigo-200 ring-2 ring-indigo-100' : 'opacity-40 grayscale'}`}>
                            <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-500">右の像</span>
                            {showRightImage && (
                                <div className="relative">
                                    <PersonStanding size={80} className="text-slate-800" />
                                    <Apple size={24} className="absolute top-4 -right-2 text-red-500 fill-current" />
                                </div>
                            )}
                        </div>

                        {/* Center Mirror View */}
                        <div className={`flex-1 border rounded-xl p-2 relative flex items-center justify-center bg-slate-50 transition-all ${showCenterImage ? 'opacity-100 border-indigo-200 ring-2 ring-indigo-100' : 'opacity-40 grayscale'}`}>
                            <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-500">奥の像</span>
                            {showCenterImage && (
                                <div className="relative">
                                    <PersonStanding size={80} className="text-slate-800" />
                                    <Apple size={24} className="absolute top-4 -left-2 text-red-500 fill-current" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Top View SVG */}
            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative select-none">
                {/* Controls */}
                <div className="absolute top-4 left-0 right-0 flex justify-center gap-4 z-10 flex-wrap px-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                        <input type="checkbox" checked={showTopImage} onChange={(e) => setShowTopImage(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                        <span className="text-xs font-bold text-slate-700">左の像</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                        <input type="checkbox" checked={showRightImage} onChange={(e) => setShowRightImage(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                        <span className="text-xs font-bold text-slate-700">右の像</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                        <input type="checkbox" checked={showCenterImage} onChange={(e) => setShowCenterImage(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                        <span className="text-xs font-bold text-slate-700">奥の像</span>
                    </label>
                </div>

                <svg viewBox="100 0 600 600" className="w-full h-full touch-none">
                    {/* Quadrant Lines */}
                    <line x1="400" y1="300" x2="400" y2="50" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
                    <line x1="400" y1="300" x2="650" y2="300" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />

                    {/* Mirrors */}
                    <rect x="150" y="295" width="250" height="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="150" y1="295" x2="400" y2="295" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
                    <rect x="395" y="300" width="10" height="250" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="405" y1="300" x2="405" y2="550" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />

                    {/* Real Person */}
                    <g>
                        {/* Arms */}
                        <line x1={eyePos.x} y1={eyePos.y} x2={leftHandPos.x} y2={leftHandPos.y} stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                        <line x1={eyePos.x} y1={eyePos.y} x2={rightHandPos.x} y2={rightHandPos.y} stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                        {/* Head */}
                        <circle cx={eyePos.x} cy={eyePos.y} r="24" className="fill-slate-800" />
                        {/* Apple on Right Hand */}
                        <Apple x={rightHandPos.x - 12} y={rightHandPos.y - 12} size={24} className="text-red-500 fill-current" />
                    </g>

                    {/* Helper Lines: Real -> Virtual */}
                    {showTopImage && (
                        <line x1={eyePos.x} y1={eyePos.y} x2={v1_head.x} y2={v1_head.y} stroke="black" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                    )}
                    {showRightImage && (
                        <line x1={eyePos.x} y1={eyePos.y} x2={v2_head.x} y2={v2_head.y} stroke="black" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                    )}
                    {showCenterImage && (
                        <line x1={eyePos.x} y1={eyePos.y} x2={v3_head.x} y2={v3_head.y} stroke="black" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                    )}

                    {/* Top Image */}
                    {showTopImage && (
                        <>
                            <g opacity="0.5">
                                <line x1={v1_head.x} y1={v1_head.y} x2={v1_left.x} y2={v1_left.y} stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                                <line x1={v1_head.x} y1={v1_head.y} x2={v1_right.x} y2={v1_right.y} stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                                <circle cx={v1_head.x} cy={v1_head.y} r="24" className="fill-slate-800" />
                                <Apple x={v1_right.x - 12} y={v1_right.y - 12} size={24} className="text-red-500 fill-current" />
                            </g>
                            {/* Rays: Apple -> Top -> Eye */}
                            <line x1={rightHandPos.x} y1={rightHandPos.y} x2={topIntersection.x} y2={topIntersection.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                            <line x1={topIntersection.x} y1={topIntersection.y} x2={eyePos.x} y2={eyePos.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                            <line x1={v1_right.x} y1={v1_right.y} x2={topIntersection.x} y2={topIntersection.y} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />
                        </>
                    )}

                    {/* Right Image */}
                    {showRightImage && (
                        <>
                            <g opacity="0.5">
                                <line x1={v2_head.x} y1={v2_head.y} x2={v2_left.x} y2={v2_left.y} stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                                <line x1={v2_head.x} y1={v2_head.y} x2={v2_right.x} y2={v2_right.y} stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                                <circle cx={v2_head.x} cy={v2_head.y} r="24" className="fill-slate-800" />
                                <Apple x={v2_right.x - 12} y={v2_right.y - 12} size={24} className="text-red-500 fill-current" />
                            </g>
                            {/* Rays: Apple -> Right -> Eye */}
                            <line x1={rightHandPos.x} y1={rightHandPos.y} x2={rightIntersection.x} y2={rightIntersection.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                            <line x1={rightIntersection.x} y1={rightIntersection.y} x2={eyePos.x} y2={eyePos.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                            <line x1={v2_right.x} y1={v2_right.y} x2={rightIntersection.x} y2={rightIntersection.y} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />
                        </>
                    )}

                    {/* Center Image */}
                    {showCenterImage && (
                        <>
                            <g opacity="0.3">
                                <line x1={v3_head.x} y1={v3_head.y} x2={v3_left.x} y2={v3_left.y} stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                                <line x1={v3_head.x} y1={v3_head.y} x2={v3_right.x} y2={v3_right.y} stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                                <circle cx={v3_head.x} cy={v3_head.y} r="24" className="fill-slate-800" />
                                <Apple x={v3_right.x - 12} y={v3_right.y - 12} size={24} className="text-red-500 fill-current" />
                            </g>
                            {/* Rays: Apple -> P2 -> P1 -> Eye */}
                            <line x1={rightHandPos.x} y1={rightHandPos.y} x2={center_p2.x} y2={center_p2.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                            <line x1={center_p2.x} y1={center_p2.y} x2={center_p1.x} y2={center_p1.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                            <line x1={center_p1.x} y1={center_p1.y} x2={eyePos.x} y2={eyePos.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                            {/* Helper: v3_right -> Eye (Direct) */}
                            <line x1={v3_right.x} y1={v3_right.y} x2={eyePos.x} y2={eyePos.y} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.3" />
                        </>
                    )}
                </svg>
            </div>
        </div>
    );
};

// Sub-component for "Human 60 Degree Mirror View"
const Human60DegreeMirrorView: React.FC = () => {
    // Center of the system
    const center = { x: 400, y: 300 };
    const radius = 150; // Distance of person from center

    // Angles (in degrees)
    // Mirrors are at 150 and 210 (60 degree opening to the left)
    // Real Person is at 180.
    // Images will be at 120, 60, 0, 300, 240.
    // Clockwise from Real (180): 
    // 1: 120 (Top-Left)
    // 2: 60 (Top-Right)
    // 3: 0 (Right)
    // 4: 300 (Bottom-Right)
    // 5: 240 (Bottom-Left)

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const [show5, setShow5] = useState(false);
    const [showRays, setShowRays] = useState(false);

    // Helper to get coordinates from angle
    const getPos = (angleDeg: number, r: number = radius) => {
        const rad = (angleDeg * Math.PI) / 180;
        return {
            x: center.x + r * Math.cos(rad),
            y: center.y + r * Math.sin(rad)
        };
    };

    // Helper to get person data (head and apple position)
    const getPersonData = (angle: number) => {
        const pos = getPos(angle);
        const facingAngle = angle + 180; // Face center
        const isFlipped = [120, 240, 0].includes(angle); // Based on odd reflections

        const handAngle = facingAngle + (isFlipped ? -90 : 90);
        const handRad = (handAngle * Math.PI) / 180;
        const handDist = 45; // Extended arm length

        const applePos = {
            x: pos.x + handDist * Math.cos(handRad),
            y: pos.y + handDist * Math.sin(handRad)
        };

        const otherHandAngle = facingAngle + (isFlipped ? 90 : -90);
        const otherHandRad = (otherHandAngle * Math.PI) / 180;
        const otherHandPos = {
            x: pos.x + handDist * Math.cos(otherHandRad),
            y: pos.y + handDist * Math.sin(otherHandRad)
        };

        return { head: pos, apple: applePos, otherHand: otherHandPos };
    };

    const renderPerson = (angle: number, opacity: number = 1) => {
        const { head, apple, otherHand } = getPersonData(angle);
        return (
            <g opacity={opacity}>
                {/* Arms */}
                <line x1={head.x} y1={head.y} x2={apple.x} y2={apple.y} stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
                <line x1={head.x} y1={head.y} x2={otherHand.x} y2={otherHand.y} stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
                {/* Head */}
                <circle cx={head.x} cy={head.y} r="20" className="fill-slate-800" />
                {/* Apple */}
                <Apple x={apple.x - 10} y={apple.y - 10} size={20} className="text-red-500 fill-current" />
            </g>
        );
    };

    // Ray Tracing Helpers
    const intersect = (p1: { x: number, y: number }, p2: { x: number, y: number }, p3: { x: number, y: number }, p4: { x: number, y: number }) => {
        const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
        if (d === 0) return null;
        const u = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
        const v = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;
        if (u >= 0 && u <= 1 && v >= 0 && v <= 1) {
            return {
                x: p1.x + u * (p2.x - p1.x),
                y: p1.y + u * (p2.y - p1.y)
            };
        }
        return null;
    };

    // Mirrors as line segments (Center to far point)
    const m1End = getPos(150, 400); // Mirror 1 at 150 deg
    const m2End = getPos(210, 400); // Mirror 2 at 210 deg

    // Real Eye and Apple
    const realData = getPersonData(180);
    const eye = realData.head;
    const realApple = realData.apple;

    // Render Ray Path
    const renderRay = (targetAngle: number, pathType: 'm1' | 'm2' | 'm1m2' | 'm2m1' | 'm1m2m1' | 'm2m1m2') => {
        const targetData = getPersonData(targetAngle);
        const targetApple = targetData.apple;

        // Points
        let p1: { x: number, y: number } | null = null;
        let p2: { x: number, y: number } | null = null;
        let p3: { x: number, y: number } | null = null;

        // 1 Reflection
        if (pathType === 'm1') {
            p1 = intersect(eye, targetApple, center, m1End);
        } else if (pathType === 'm2') {
            p1 = intersect(eye, targetApple, center, m2End);
        }

        // 2 Reflections
        else if (pathType === 'm2m1') { // Eye -> M1 -> M2 -> Apple (Image 2)
            p1 = intersect(eye, targetApple, center, m1End); // Hit M1 looking at Image 2
            if (p1) {
                // From P1, look at Image 5 (240) to find P2 on M2
                const v5Apple = getPersonData(240).apple;
                p2 = intersect(p1, v5Apple, center, m2End);
            }
        }
        else if (pathType === 'm1m2') { // Eye -> M2 -> M1 -> Apple (Image 4)
            p1 = intersect(eye, targetApple, center, m2End); // Hit M2 looking at Image 4
            if (p1) {
                // From P1, look at Image 1 (120) to find P2 on M1
                const v1Apple = getPersonData(120).apple;
                p2 = intersect(p1, v1Apple, center, m1End);
            }
        }

        // 3 Reflections (Image 3)
        else if (pathType === 'm2m1m2') { // Eye -> M2 -> M1 -> M2 -> Apple
            p1 = intersect(eye, targetApple, center, m2End); // Hit M2 looking at Image 3
            if (p1) {
                const v2Apple = getPersonData(60).apple;
                p2 = intersect(p1, v2Apple, center, m1End); // Hit M1 looking at Image 2
                if (p2) {
                    const v5Apple = getPersonData(240).apple;
                    p3 = intersect(p2, v5Apple, center, m2End); // Hit M2 looking at Image 5
                }
            }
        }
        else if (pathType === 'm1m2m1') { // Eye -> M1 -> M2 -> M1 -> Apple
            p1 = intersect(eye, targetApple, center, m1End); // Hit M1 looking at Image 3
            if (p1) {
                const v4Apple = getPersonData(300).apple;
                p2 = intersect(p1, v4Apple, center, m2End); // Hit M2 looking at Image 4
                if (p2) {
                    const v1Apple = getPersonData(120).apple;
                    p3 = intersect(p2, v1Apple, center, m1End); // Hit M1 looking at Image 1
                }
            }
        }

        if (!p1) return null;

        return (
            <g>
                {/* Virtual Ray (Dashed) */}
                <line x1={targetApple.x} y1={targetApple.y} x2={p1.x} y2={p1.y} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />

                {/* Real Path */}
                {/* Eye -> P1 */}
                <line x1={eye.x} y1={eye.y} x2={p1.x} y2={p1.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />

                {p2 ? (
                    <>
                        {/* P1 -> P2 */}
                        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                        {p3 ? (
                            <>
                                {/* P2 -> P3 */}
                                <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                                {/* P3 -> Real Apple */}
                                <line x1={p3.x} y1={p3.y} x2={realApple.x} y2={realApple.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                            </>
                        ) : (
                            /* P2 -> Real Apple */
                            <line x1={p2.x} y1={p2.y} x2={realApple.x} y2={realApple.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                        )}
                    </>
                ) : (
                    /* P1 -> Real Apple */
                    <line x1={p1.x} y1={p1.y} x2={realApple.x} y2={realApple.y} stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
                )}
            </g>
        );
    };

    const toggles = [
        { id: 1, angle: 120, label: '①', state: show1, setter: setShow1 },
        { id: 2, angle: 60, label: '②', state: show2, setter: setShow2 },
        { id: 3, angle: 0, label: '③', state: show3, setter: setShow3 },
        { id: 4, angle: 300, label: '④', state: show4, setter: setShow4 },
        { id: 5, angle: 240, label: '⑤', state: show5, setter: setShow5 },
    ];

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative select-none">

                {/* Top Controls */}
                <div className="absolute top-4 left-0 right-0 flex justify-center z-20 pointer-events-auto">
                    <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                        <input
                            type="checkbox"
                            checked={showRays}
                            onChange={(e) => setShowRays(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm font-bold text-slate-700">光の進み方</span>
                    </label>
                </div>

                {/* Radial Controls */}
                <div className="absolute inset-0 pointer-events-none z-10">
                    {toggles.map((t) => {
                        // Calculate position for the button
                        // Center is 50%, 50%
                        // Radius for buttons needs to be outside the person radius (150 in SVG units)
                        // SVG width is 600 units. 150 units is 25% width.
                        // Let's place buttons at radius ~240 units (40% width)
                        const r = 40; // %
                        const rad = (t.angle * Math.PI) / 180;
                        const left = 50 + r * Math.cos(rad);
                        const top = 50 + r * Math.sin(rad);

                        return (
                            <div
                                key={t.id}
                                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${left}%`, top: `${top}%` }}
                            >
                                <label className={`
                                    flex items-center justify-center w-16 h-16 rounded-full cursor-pointer shadow-md border-2 transition-all
                                    ${t.state
                                        ? 'bg-indigo-600 border-indigo-600 text-white'
                                        : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-500'
                                    }
                                `}>
                                    <input
                                        type="checkbox"
                                        checked={t.state}
                                        onChange={(e) => t.setter(e.target.checked)}
                                        className="hidden"
                                    />
                                    <span className="text-2xl font-bold">{t.label}</span>
                                </label>
                            </div>
                        );
                    })}
                </div>

                <svg viewBox="100 0 600 600" className="w-full h-full touch-none">
                    {/* Sectors (Dashed Lines) */}
                    {[30, 90, 270, 330].map(deg => {
                        const pos = getPos(deg, 300);
                        return <line key={deg} x1={center.x} y1={center.y} x2={pos.x} y2={pos.y} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />;
                    })}

                    {/* Mirrors (Solid Lines) at 150 and 210 */}
                    {[150, 210].map(deg => {
                        const pos = getPos(deg, 300);
                        return <line key={deg} x1={center.x} y1={center.y} x2={pos.x} y2={pos.y} stroke="#94a3b8" strokeWidth="4" />;
                    })}

                    {/* Real Person (180 deg) */}
                    {renderPerson(180)}

                    {/* Images */}
                    {show1 && renderPerson(120, 0.5)}
                    {show2 && renderPerson(60, 0.5)}
                    {show3 && renderPerson(0, 0.5)}
                    {show4 && renderPerson(300, 0.5)}
                    {show5 && renderPerson(240, 0.5)}

                    {/* Rays - Only show if showRays is true AND the specific image is toggled */}
                    {showRays && show1 && renderRay(120, 'm1')}
                    {showRays && show5 && renderRay(240, 'm2')}
                    {showRays && show2 && renderRay(60, 'm2m1')}
                    {showRays && show4 && renderRay(300, 'm1m2')}
                    {showRays && show3 && renderRay(0, 'm1m2m1')}

                </svg>
            </div>
        </div>
    );
};

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

type UnitId = 'apple_side' | 'apple_top' | 'apple_double_mirror' | 'human_mirror' | 'human_double_mirror' | 'human_60_degree';

const UNITS = [
    { id: 'apple_side', title: '鏡にうつるりんご', subtitle: '横から見たら', icon: Apple },
    { id: 'apple_top', title: '鏡にうつるりんご', subtitle: '上から見たら', icon: Apple },
    { id: 'apple_double_mirror', title: 'かがみにうつるりんご', subtitle: 'かがみが二つあると？', icon: Apple },
    { id: 'human_mirror', title: '鏡にうつる人間', subtitle: '左右が変わる？', icon: PersonStanding },
    { id: 'human_double_mirror', title: '鏡にうつる人間', subtitle: '鏡が二つあると？', icon: PersonStanding },
    { id: 'human_60_degree', title: '鏡にうつる人間', subtitle: '鏡の角度が変わると？', icon: PersonStanding },
] as const;

// Sub-component for "Apple Side View"
const AppleDoubleMirrorView: React.FC = () => {
    // Coordinate system: viewBox="0 0 800 600"
    // Mirror 1 (Top): Y=300, X=150~400
    // Mirror 2 (Right): X=400, Y=300~550
    // Origin of mirrors: (400, 300)
    // Apple Area: X < 400, Y > 300

    const [applePos, setApplePos] = useState({ x: 300, y: 400 });
    const [isDragging, setIsDragging] = useState(false);

    // Toggles
    const [showControls, setShowControls] = useState(false); // Master toggle for controls visibility
    const [showTopImage, setShowTopImage] = useState(false);      // "左側の鏡" (Top Mirror)
    const [showRightImage, setShowRightImage] = useState(false);  // "右側の鏡" (Right Mirror)
    const [showDiagonalImage, setShowDiagonalImage] = useState(false); // "もうひとつ" (Diagonal)

    const mirrorOrigin = { x: 400, y: 300 };
    const eyePos = { x: 200, y: 500 }; // Observer position (bottom left)

    // Calculate Virtual Images
    // 1. Image by Top Mirror (Reflect Y across 300)
    const virtualApple1 = {
        x: applePos.x,
        y: mirrorOrigin.y - (applePos.y - mirrorOrigin.y)
    };

    // 2. Image by Right Mirror (Reflect X across 400)
    const virtualApple2 = {
        x: mirrorOrigin.x + (mirrorOrigin.x - applePos.x),
        y: applePos.y
    };

    // 3. Image by Both (Reflect both)
    const virtualApple3 = {
        x: mirrorOrigin.x + (mirrorOrigin.x - applePos.x),
        y: mirrorOrigin.y - (applePos.y - mirrorOrigin.y)
    };

    // Calculate Ray Intersections
    const calculateIntersection = (virtual: { x: number, y: number }, mirrorAxis: 'x' | 'y', mirrorPos: number) => {
        // Line from Eye to Virtual Point
        // P = Eye + t * (Virtual - Eye)
        // We want P[axis] = mirrorPos
        // t = (mirrorPos - Eye[axis]) / (Virtual[axis] - Eye[axis])

        if (mirrorAxis === 'y') {
            const t = (mirrorPos - eyePos.y) / (virtual.y - eyePos.y);
            return { x: eyePos.x + t * (virtual.x - eyePos.x), y: mirrorPos };
        } else {
            const t = (mirrorPos - eyePos.x) / (virtual.x - eyePos.x);
            return { x: mirrorPos, y: eyePos.y + t * (virtual.y - eyePos.y) };
        }
    };

    const topIntersection = calculateIntersection(virtualApple1, 'y', 300);
    const rightIntersection = calculateIntersection(virtualApple2, 'x', 400);

    // Calculate Double Reflection Points
    // We need to determine the order of reflection:
    // Path A: Apple -> Top Mirror -> Right Mirror -> Eye (Last reflection at Right Mirror)
    // Path B: Apple -> Right Mirror -> Top Mirror -> Eye (Last reflection at Top Mirror)

    // Trace back from Eye to VirtualApple3
    // Does the line segment (Eye -> VirtualApple3) intersect the Right Mirror (X=400) or Top Mirror (Y=300)?

    // Intersection with Right Mirror (X=400)
    const t_right = (400 - eyePos.x) / (virtualApple3.x - eyePos.x);
    const y_at_right = eyePos.y + t_right * (virtualApple3.y - eyePos.y);
    const hitRightFirst = y_at_right > 300; // Valid if Y is below the corner (300)

    // Intersection with Top Mirror (Y=300)
    const t_top = (300 - eyePos.y) / (virtualApple3.y - eyePos.y);
    const x_at_top = eyePos.x + t_top * (virtualApple3.x - eyePos.x);
    // const hitTopFirst = x_at_top < 400; // Valid if X is left of the corner (400)

    // Note: Mathematically, for a point in the bottom-left looking at top-right, it will cross either x=400 (y>300) OR y=300 (x<400).
    // So hitRightFirst and hitTopFirst should be mutually exclusive for the primary intersection.

    let p1, p2, virtualSource;

    if (hitRightFirst) {
        // Path A: Last reflection at Right Mirror (P1)
        // Ray comes from VirtualApple1 (Image of Apple by Top Mirror)
        // Path: Apple -> Top(P2) -> Right(P1) -> Eye
        p1 = { x: 400, y: y_at_right };

        // P2 is intersection of (P1 -> VirtualApple1) with Top Mirror (Y=300)
        const t2 = (300 - p1.y) / (virtualApple1.y - p1.y);
        p2 = { x: p1.x + t2 * (virtualApple1.x - p1.x), y: 300 };
        virtualSource = virtualApple1;

    } else {
        // Path B: Last reflection at Top Mirror (P1)
        // Ray comes from VirtualApple2 (Image of Apple by Right Mirror)
        // Path: Apple -> Right(P2) -> Top(P1) -> Eye
        p1 = { x: x_at_top, y: 300 };

        // P2 is intersection of (P1 -> VirtualApple2) with Right Mirror (X=400)
        const t2 = (400 - p1.x) / (virtualApple2.x - p1.x);
        p2 = { x: 400, y: p1.y + t2 * (virtualApple2.y - p1.y) };
        virtualSource = virtualApple2;
    }


    // Drag Handlers
    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;

        const svg = e.currentTarget.closest('svg');
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        const scaleX = 800 / rect.width;
        const scaleY = 600 / rect.height;

        let newX = (clientX - rect.left) * scaleX;
        let newY = (clientY - rect.top) * scaleY;

        // Constraints: Stay within the "Real" quadrant (X < 400, Y > 300)
        if (newX > 370) newX = 370; // Padding from mirror
        if (newX < 50) newX = 50;
        if (newY < 330) newY = 330; // Padding from mirror
        if (newY > 550) newY = 550;

        setApplePos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative select-none">

            {/* Controls */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-4 z-10 flex-wrap px-4 items-center">
                {/* Master Toggle */}
                <button
                    onClick={() => setShowControls(!showControls)}
                    className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors text-slate-600"
                >
                    {showControls ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>

                {/* Individual Toggles */}
                {showControls && (
                    <>
                        <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                            <input
                                type="checkbox"
                                checked={showTopImage}
                                onChange={(e) => setShowTopImage(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-xs font-bold text-slate-700">左側の鏡に映るりんご</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                            <input
                                type="checkbox"
                                checked={showRightImage}
                                onChange={(e) => setShowRightImage(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-xs font-bold text-slate-700">右側の鏡に映るりんご</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                            <input
                                type="checkbox"
                                checked={showDiagonalImage}
                                onChange={(e) => setShowDiagonalImage(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-xs font-bold text-slate-700">もうひとつのりんご</span>
                        </label>
                    </>
                )}
            </div>

            <svg
                viewBox="0 0 800 600"
                className="w-full h-full touch-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Quadrant Lines (Virtual Space Boundaries) */}
                <line x1="400" y1="300" x2="400" y2="50" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="400" y1="300" x2="650" y2="300" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />

                {/* Mirrors */}
                {/* Mirror 1 (Top): Y=300, X=150~400 (Length 250) */}
                <rect x="150" y="295" width="250" height="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="150" y1="295" x2="400" y2="295" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" /> {/* Back side */}

                {/* Mirror 2 (Right): X=400, Y=300~550 (Length 250) */}
                <rect x="395" y="300" width="10" height="250" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="405" y1="300" x2="405" y2="550" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" /> {/* Back side */}

                {/* Person (Circle) */}
                <g transform={`translate(${eyePos.x}, ${eyePos.y})`}>
                    <circle cx="0" cy="0" r="24" className="fill-slate-800" />
                </g>

                {/* 1. Top Mirror Image & Rays */}
                {showTopImage && (
                    <>
                        {/* Virtual Ray (Dashed) */}
                        <line
                            x1={virtualApple1.x} y1={virtualApple1.y}
                            x2={topIntersection.x} y2={topIntersection.y}
                            stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5"
                        />
                        {/* Real Rays (Solid) */}
                        <line
                            x1={applePos.x} y1={applePos.y}
                            x2={topIntersection.x} y2={topIntersection.y}
                            stroke="#f59e0b" strokeWidth="2" opacity="0.8"
                        />
                        <line
                            x1={topIntersection.x} y1={topIntersection.y}
                            x2={eyePos.x} y2={eyePos.y}
                            stroke="#f59e0b" strokeWidth="2" opacity="0.8"
                        />
                        {/* Virtual Apple */}
                        <g transform={`translate(${virtualApple1.x - 24}, ${virtualApple1.y - 24})`} opacity="0.5">
                            <Apple size={48} className="text-red-500 fill-current" />
                        </g>
                    </>
                )}

                {/* 2. Right Mirror Image & Rays */}
                {showRightImage && (
                    <>
                        {/* Virtual Ray (Dashed) */}
                        <line
                            x1={virtualApple2.x} y1={virtualApple2.y}
                            x2={rightIntersection.x} y2={rightIntersection.y}
                            stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5"
                        />
                        {/* Real Rays (Solid) */}
                        <line
                            x1={applePos.x} y1={applePos.y}
                            x2={rightIntersection.x} y2={rightIntersection.y}
                            stroke="#f59e0b" strokeWidth="2" opacity="0.8"
                        />
                        <line
                            x1={rightIntersection.x} y1={rightIntersection.y}
                            x2={eyePos.x} y2={eyePos.y}
                            stroke="#f59e0b" strokeWidth="2" opacity="0.8"
                        />
                        {/* Virtual Apple */}
                        <g transform={`translate(${virtualApple2.x - 24}, ${virtualApple2.y - 24})`} opacity="0.5">
                            <Apple size={48} className="text-red-500 fill-current" />
                        </g>
                    </>
                )}

                {/* 3. Diagonal Image & Rays */}
                {showDiagonalImage && (
                    <>
                        {/* Virtual Ray (Dashed only, direct to eye) */}
                        <line
                            x1={virtualApple3.x} y1={virtualApple3.y}
                            x2={eyePos.x} y2={eyePos.y}
                            stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5"
                        />

                        {/* Double Reflection Rays (Solid) */}
                        {/* Apple -> P2 (First Mirror) */}
                        <line
                            x1={applePos.x} y1={applePos.y}
                            x2={p2.x} y2={p2.y}
                            stroke="#f59e0b" strokeWidth="2" opacity="0.8"
                        />
                        {/* P2 -> P1 (Second Mirror) */}
                        <line
                            x1={p2.x} y1={p2.y}
                            x2={p1.x} y2={p1.y}
                            stroke="#f59e0b" strokeWidth="2" opacity="0.8"
                        />
                        {/* P1 -> Eye */}
                        <line
                            x1={p1.x} y1={p1.y}
                            x2={eyePos.x} y2={eyePos.y}
                            stroke="#f59e0b" strokeWidth="2" opacity="0.8"
                        />

                        {/* Helper Dashed Line: VirtualSource -> P1 (Shows where the ray from P1 seems to come from) */}
                        <line
                            x1={virtualSource.x} y1={virtualSource.y}
                            x2={p1.x} y2={p1.y}
                            stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.3"
                        />

                        {/* Virtual Apple */}
                        <g transform={`translate(${virtualApple3.x - 24}, ${virtualApple3.y - 24})`} opacity="0.3">
                            <Apple size={48} className="text-red-500 fill-current" />
                        </g>
                    </>
                )}

                {/* Real Apple (Object) */}
                <g
                    transform={`translate(${applePos.x - 24}, ${applePos.y - 24})`}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className="cursor-move hover:scale-110"
                    style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.2))' }}
                >
                    <Apple size={48} className="text-red-500 fill-current" />
                </g>

            </svg>
        </div>
    );
};

// Sub-component for "Apple Side View"
const AppleSideView: React.FC = () => {
    // Coordinate system: viewBox="0 0 800 600"
    // Ground Y = 500
    // Mirror X = 400 (Centered)

    const [applePos, setApplePos] = useState({ x: 250, y: 476 });
    const [isDragging, setIsDragging] = useState(false);
    const [showRealRays, setShowRealRays] = useState(false);
    const [showVirtualImage, setShowVirtualImage] = useState(false);

    const mirrorX = 400;
    const eyePos = { x: 80, y: 310 }; // Adjusted to target head center

    // Calculate Virtual Image Position (Symmetric with respect to mirror)
    const virtualApplePos = {
        x: mirrorX + (mirrorX - applePos.x),
        y: applePos.y
    };

    // Calculate Rays for Top, Center, Bottom
    const rayOffsets = [-18, 0, 18]; // Top, Center, Bottom (slightly inside the 48px icon)

    const rays = rayOffsets.map((offset, index) => {
        const sourcePoint = { x: applePos.x, y: applePos.y + offset };
        const virtualPoint = { x: mirrorX + (mirrorX - sourcePoint.x), y: sourcePoint.y };

        // Reflection Point calculation
        const slope = (virtualPoint.y - eyePos.y) / (virtualPoint.x - eyePos.x);
        const reflectionY = eyePos.y + slope * (mirrorX - eyePos.x);
        const reflectionPoint = { x: mirrorX, y: reflectionY };

        return { sourcePoint, virtualPoint, reflectionPoint, key: index };
    });

    // Drag Handlers
    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;

        let clientX;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = (e as React.MouseEvent).clientX;
        }

        // Simple mapping from screen to SVG coordinates (approximate for full screen)
        // Ideally use ref and getBoundingClientRect
        const svg = e.currentTarget.closest('svg');
        if (svg) {
            const rect = svg.getBoundingClientRect();
            const scaleX = 800 / rect.width;
            const x = (clientX - rect.left) * scaleX;

            // Limit movement to left side
            if (x > 50 && x < 350) {
                setApplePos(prev => ({ ...prev, x }));
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative select-none">

            {/* Controls */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-8 z-10">
                <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                    <input
                        type="checkbox"
                        checked={showRealRays}
                        onChange={(e) => setShowRealRays(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-700">光の進み方</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                    <input
                        type="checkbox"
                        checked={showVirtualImage}
                        onChange={(e) => setShowVirtualImage(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-700">鏡の中の像</span>
                </label>
            </div>

            <svg
                viewBox="0 0 800 600"
                className="w-full h-full touch-none"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                {/* Ground */}
                <line x1="0" y1="500" x2="800" y2="500" stroke="#cbd5e1" strokeWidth="2" />

                {/* Mirror - Unified Style */}
                <line x1="400" y1="150" x2="400" y2="500" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="400" y1="150" x2="400" y2="500" stroke="#94a3b8" strokeWidth="4" />

                {/* Eye (Person) */}
                <g transform={`translate(${eyePos.x}, ${eyePos.y})`}>
                    {/* Head */}
                    <circle cx="0" cy="0" r="30" className="fill-slate-800" />
                    {/* Body */}
                    <path d="M -20 30 Q 0 60 20 30 V 190 H -20 Z" className="fill-slate-800" />
                    {/* Eye */}
                    <circle cx="12" cy="-5" r="4" fill="white" />
                    <circle cx="14" cy="-5" r="2" fill="black" />
                </g>

                {/* Rays */}
                {rays.map(ray => (
                    <g key={ray.key}>
                        {/* 1. Virtual Point -> Eye (Straight line perception) - Only if Virtual Image is ON */}
                        {showVirtualImage && (
                            <line
                                x1={ray.virtualPoint.x}
                                y1={ray.virtualPoint.y}
                                x2={eyePos.x}
                                y2={eyePos.y}
                                stroke="#ef4444" // Red
                                strokeWidth="1.5"
                                strokeDasharray="4,4"
                                opacity="0.5"
                            />
                        )}

                        {/* 2. Real Point -> Mirror (Incident Ray) - Only if Real Rays are ON */}
                        {showRealRays && (
                            <line
                                x1={ray.sourcePoint.x}
                                y1={ray.sourcePoint.y}
                                x2={ray.reflectionPoint.x}
                                y2={ray.reflectionPoint.y}
                                stroke="#ef4444" // Red
                                strokeWidth="2"
                                strokeDasharray="6,3"
                                opacity="0.8"
                            />
                        )}

                        {/* 3. Mirror -> Eye (Reflected Ray) - Only if Real Rays are ON */}
                        {showRealRays && (
                            <line
                                x1={ray.reflectionPoint.x}
                                y1={ray.reflectionPoint.y}
                                x2={eyePos.x}
                                y2={eyePos.y}
                                stroke="#ef4444" // Red
                                strokeWidth="2"
                                opacity="0.8"
                            />
                        )}
                    </g>
                ))}

                {/* Virtual Apple (Image) - Only if Virtual Image is ON */}
                {showVirtualImage && (
                    <g transform={`translate(${virtualApplePos.x - 24}, ${virtualApplePos.y - 24})`} opacity="0.5">
                        <Apple size={48} className="text-red-500 fill-current" />
                    </g>
                )}

                {/* Real Apple (Object) */}
                <g
                    transform={`translate(${applePos.x - 24}, ${applePos.y - 24})`}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className="cursor-move hover:scale-110"
                    style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.2))' }}
                >
                    <Apple size={48} className="text-red-500 fill-current" />
                </g>

            </svg>
        </div>
    );
};

// Sub-component for "Apple Top View"
const AppleTopView: React.FC = () => {
    // Coordinate system: viewBox="0 0 800 600"
    // Mirror: Horizontal at Y = 300
    // Eye: Fixed at (400, 500)

    const [applePos, setApplePos] = useState({ x: 250, y: 400 });
    const [isDragging, setIsDragging] = useState(false);
    const [showRealRays, setShowRealRays] = useState(false);
    const [showVirtualImage, setShowVirtualImage] = useState(false);

    const mirrorY = 300;
    const eyePos = { x: 400, y: 500 };

    // Calculate Virtual Image Position (Symmetric with respect to mirror)
    const virtualApplePos = {
        x: applePos.x,
        y: mirrorY - (applePos.y - mirrorY)
    };

    // Calculate Ray
    // 1. Virtual Point
    const virtualPoint = virtualApplePos;

    // 2. Reflection Point (Intersection of line (Eye -> Virtual) and Mirror (Y=300))
    // Line: P = Eye + t * (Virtual - Eye)
    // Y = Eye.y + t * (Virtual.y - Eye.y) = 300
    // t = (300 - Eye.y) / (Virtual.y - Eye.y)
    const t = (mirrorY - eyePos.y) / (virtualPoint.y - eyePos.y);
    const reflectionX = eyePos.x + t * (virtualPoint.x - eyePos.x);
    const reflectionPoint = { x: reflectionX, y: mirrorY };

    // Drag Handlers
    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const svg = e.currentTarget.closest('svg');
        if (svg) {
            const rect = svg.getBoundingClientRect();
            const scaleX = 800 / rect.width;
            const scaleY = 600 / rect.height;
            const x = (clientX - rect.left) * scaleX;
            const y = (clientY - rect.top) * scaleY;

            // Limit movement to below mirror
            if (y > 350 && y < 550 && x > 50 && x < 750) {
                setApplePos({ x, y });
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative select-none">

            {/* Controls */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-8 z-10">
                <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                    <input
                        type="checkbox"
                        checked={showRealRays}
                        onChange={(e) => setShowRealRays(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-700">光の進み方</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                    <input
                        type="checkbox"
                        checked={showVirtualImage}
                        onChange={(e) => setShowVirtualImage(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-700">鏡の中の像</span>
                </label>
            </div>

            <svg
                viewBox="0 0 800 600"
                className="w-full h-full touch-none"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                {/* Mirror - Unified Style */}
                <rect x="50" y={mirrorY - 5} width="700" height="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="50" y1={mirrorY + 5} x2="750" y2={mirrorY + 5} stroke="#94a3b8" strokeWidth="2" />

                {/* Eye (Top View) */}
                <g transform={`translate(${eyePos.x}, ${eyePos.y})`}>
                    <Eye size={48} className="text-slate-800" />
                </g>

                {/* Rays */}
                <g>
                    {/* Virtual Ray */}
                    {showVirtualImage && (
                        <line
                            x1={virtualPoint.x}
                            y1={virtualPoint.y}
                            x2={eyePos.x}
                            y2={eyePos.y}
                            stroke="#ef4444" // Red
                            strokeWidth="1.5"
                            strokeDasharray="4,4"
                            opacity="0.5"
                        />
                    )}

                    {/* Real Rays */}
                    {showRealRays && (
                        <>
                            {/* Incident Ray */}
                            <line
                                x1={applePos.x}
                                y1={applePos.y}
                                x2={reflectionPoint.x}
                                y2={reflectionPoint.y}
                                stroke="#ef4444" // Red
                                strokeWidth="2"
                                strokeDasharray="6,3"
                                opacity="0.8"
                            />
                            {/* Reflected Ray */}
                            <line
                                x1={reflectionPoint.x}
                                y1={reflectionPoint.y}
                                x2={eyePos.x}
                                y2={eyePos.y}
                                stroke="#ef4444" // Red
                                strokeWidth="2"
                                opacity="0.8"
                            />
                        </>
                    )}
                </g>

                {/* Virtual Apple */}
                {showVirtualImage && (
                    <g transform={`translate(${virtualApplePos.x - 24}, ${virtualApplePos.y - 24})`} opacity="0.5">
                        <Apple size={48} className="text-red-500 fill-current" />
                    </g>
                )}

                {/* Real Apple */}
                <g
                    transform={`translate(${applePos.x - 24}, ${applePos.y - 24})`}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className="cursor-move hover:scale-110"
                    style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.2))' }}
                >
                    <Apple size={48} className="text-red-500 fill-current" />
                </g>

            </svg>
        </div>
    );
};

// Sub-component for "Human Mirror View"
const HumanMirrorView: React.FC = () => {
    // Coordinate system: viewBox="0 0 800 600"
    // Mirror: Horizontal at Y = 300
    // Person: At Bottom Center (X=400, Y=500)

    const [showRays, setShowRays] = useState(false);
    const [showVirtualImage, setShowVirtualImage] = useState(false);

    const mirrorY = 300;
    const eyePos = { x: 400, y: 500 };
    const handOffset = 80;

    // Top view positions (Person facing mirror/up)
    // Left hand is on the left side (x < 400) -> Empty
    // Right hand is on the right side (x > 400) -> Red Apple
    const leftHandPos = { x: eyePos.x - handOffset, y: eyePos.y };
    const rightHandPos = { x: eyePos.x + handOffset, y: eyePos.y }; // Red Apple

    // Calculate Virtual Image Positions
    const virtualEyePos = { x: eyePos.x, y: mirrorY - (eyePos.y - mirrorY) };
    const virtualLeftHandPos = { x: leftHandPos.x, y: mirrorY - (leftHandPos.y - mirrorY) };
    const virtualRightHandPos = { x: rightHandPos.x, y: mirrorY - (rightHandPos.y - mirrorY) };

    // Calculate Rays
    const calculateRay = (source: { x: number, y: number }) => {
        const virtualPoint = { x: source.x, y: mirrorY - (source.y - mirrorY) };

        // Reflection Point calculation
        const t = (mirrorY - virtualPoint.y) / (eyePos.y - virtualPoint.y);
        const reflectionX = virtualPoint.x + t * (eyePos.x - virtualPoint.x);
        const reflectionPoint = { x: reflectionX, y: mirrorY };

        return { source, virtualPoint, reflectionPoint };
    };

    // Only ray from Right Hand (Apple)
    const ray = calculateRay(rightHandPos);

    return (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative select-none">

            {/* Controls */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-8 z-10">
                <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                    <input
                        type="checkbox"
                        checked={showRays}
                        onChange={(e) => setShowRays(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-700">光の進み方</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-white transition-colors">
                    <input
                        type="checkbox"
                        checked={showVirtualImage}
                        onChange={(e) => setShowVirtualImage(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-700">鏡の中の像</span>
                </label>
            </div>

            {/* Area A: Front View Illustration (Bottom Left) - Real Image */}
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 z-10">
                <span className="text-xs font-bold text-slate-500">正面から見た人間</span>
                <div className="relative w-24 h-32 flex items-center justify-center">
                    <PersonStanding size={80} className="text-slate-800" />
                    {/* Right Hand (Screen Left) -> Red Apple */}
                    <div className="absolute top-11 left-2">
                        <Apple className="w-6 h-6 text-red-500 fill-current" />
                    </div>
                </div>
            </div>

            {/* Area B: Front View Illustration (Top Left) - Virtual Image */}
            <div className="absolute top-24 left-8 bg-white/90 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 z-10">
                <span className="text-xs font-bold text-slate-500">鏡の中の人間</span>
                <div className="relative w-24 h-32 flex items-center justify-center opacity-50">
                    {showVirtualImage && (
                        <>
                            <PersonStanding size={80} className="text-slate-800" />
                            {/* Mirror Image: Flipped */}
                            {/* Screen Right -> Red Apple */}
                            <div className="absolute top-11 right-2">
                                <Apple className="w-6 h-6 text-red-500 fill-current" />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <svg
                viewBox="0 0 800 600"
                className="w-full h-full touch-none"
            >
                {/* Mirror (Horizontal) - Unified Style */}
                <line x1="50" y1={mirrorY} x2="750" y2={mirrorY} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="50" y1={mirrorY} x2="750" y2={mirrorY} stroke="#94a3b8" strokeWidth="4" />

                {/* Person (Top View) */}
                <g transform={`translate(${eyePos.x}, ${eyePos.y})`}>
                    {/* Arms */}
                    <line x1="0" y1="0" x2={-handOffset} y2="0" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                    <line x1="0" y1="0" x2={handOffset} y2="0" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                    {/* Head */}
                    <circle cx="0" cy="0" r="24" className="fill-slate-800" />
                </g>

                {/* Hands (Top View) */}
                {/* Right Hand (Red Apple) */}
                <Apple x={rightHandPos.x - 12} y={rightHandPos.y - 12} size={24} className="text-red-500 fill-current" />

                {/* Rays */}
                <g>
                    {/* Virtual Ray (Straight line from virtual point to eye) */}
                    {showVirtualImage && (
                        <line
                            x1={ray.virtualPoint.x}
                            y1={ray.virtualPoint.y}
                            x2={eyePos.x}
                            y2={eyePos.y}
                            stroke="#ef4444" // Red
                            strokeWidth="1.5"
                            strokeDasharray="4,4"
                            opacity="0.4"
                        />
                    )}

                    {/* Real Rays */}
                    {showRays && (
                        <>
                            {/* Incident Ray (Source -> Mirror) */}
                            <line
                                x1={ray.source.x}
                                y1={ray.source.y}
                                x2={ray.reflectionPoint.x}
                                y2={ray.reflectionPoint.y}
                                stroke="#ef4444" // Red
                                strokeWidth="2"
                                strokeDasharray="6,3"
                                opacity="0.8"
                            />
                            {/* Reflected Ray (Mirror -> Eye) */}
                            <line
                                x1={ray.reflectionPoint.x}
                                y1={ray.reflectionPoint.y}
                                x2={eyePos.x}
                                y2={eyePos.y}
                                stroke="#ef4444" // Red
                                strokeWidth="2"
                                opacity="0.8"
                            />
                        </>
                    )}
                </g>

                {/* Virtual Image (Top View) */}
                {showVirtualImage && (
                    <g opacity="0.5">
                        {/* Arms */}
                        <line x1={virtualEyePos.x} y1={virtualEyePos.y} x2={virtualLeftHandPos.x} y2={virtualLeftHandPos.y} stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                        <line x1={virtualEyePos.x} y1={virtualEyePos.y} x2={virtualRightHandPos.x} y2={virtualRightHandPos.y} stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                        {/* Head */}
                        <circle cx={virtualEyePos.x} cy={virtualEyePos.y} r="24" className="fill-slate-800" />
                        {/* Right Hand (Red Apple) - Appears on the same side (right) in mirror world coordinates, but visually flipped relative to person */}
                        <Apple x={virtualRightHandPos.x - 12} y={virtualRightHandPos.y - 12} size={24} className="text-red-500 fill-current" />
                    </g>
                )}

            </svg>
        </div>
    );
};

export const MirrorLesson: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [currentUnit, setCurrentUnit] = useState<UnitId>('apple_side');

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shrink-0">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">鏡のふしぎ</h1>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Unit List */}
                <div className="w-80 border-r border-slate-200 bg-white p-6 flex flex-col gap-4 overflow-y-auto">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">学習すること</h2>
                    <div className="flex flex-col gap-3">
                        {UNITS.map((unit) => {
                            const Icon = unit.icon;
                            const isSelected = currentUnit === unit.id;
                            return (
                                <button
                                    key={unit.id}
                                    onClick={() => setCurrentUnit(unit.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl text-left transition-all border",
                                        isSelected
                                            ? "bg-indigo-50 border-indigo-200 shadow-sm"
                                            : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                        isSelected ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            isSelected ? "text-indigo-900" : "text-slate-800"
                                        )}>
                                            {unit.title}
                                        </span>
                                        <span className={cn(
                                            "text-xs",
                                            isSelected ? "text-indigo-600" : "text-slate-500"
                                        )}>
                                            {unit.subtitle}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Panel: Content Area */}
                <div className="flex-1 bg-slate-50 p-8 flex flex-col overflow-hidden">
                    {currentUnit === 'apple_side' ? (
                        <AppleSideView />
                    ) : currentUnit === 'apple_top' ? (
                        <AppleTopView />
                    ) : currentUnit === 'apple_double_mirror' ? (
                        <AppleDoubleMirrorView />
                    ) : currentUnit === 'human_mirror' ? (
                        <HumanMirrorView />
                    ) : currentUnit === 'human_double_mirror' ? (
                        <HumanDoubleMirrorView />
                    ) : currentUnit === 'human_60_degree' ? (
                        <Human60DegreeMirrorView />
                    ) : (
                        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <Monitor className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                {UNITS.find(u => u.id === currentUnit)?.title}
                            </h3>
                            <p className="text-slate-500">
                                この単元のコンテンツは準備中です。
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
