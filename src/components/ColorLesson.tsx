import React, { useState, useEffect } from 'react';
import { Sun, Eye, ArrowLeft, Apple } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind class merging
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

type Color = 'white' | 'red' | 'blue' | 'black';
type Cellophane = 'none' | 'red' | 'blue';

// Helper component to draw rays with dots
const Ray: React.FC<{
    start: { x: number, y: number };
    end: { x: number, y: number };
    type: 'rgb' | 'red' | 'blue' | 'none' | 'white' | 'black';
}> = ({ start, end, type }) => {
    if (type === 'none' || type === 'black') return null;

    // Calculate distance to determine number of dots
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Dot spacing in percentage (approx)
    const spacing = 1.5;
    const count = Math.floor(dist / spacing);

    const dots = [];
    for (let i = 0; i <= count; i++) {
        const t = i / count;
        const x = start.x + dx * t;
        const y = start.y + dy * t;

        // Determine color based on type and index
        let fill = '#94a3b8'; // default slate-400

        if (type === 'red') fill = '#ef4444';
        else if (type === 'blue') fill = '#3b82f6';
        else if (type === 'rgb' || type === 'white') {
            const mod = i % 3;
            if (mod === 0) fill = '#ef4444'; // Red
            else if (mod === 1) fill = '#22c55e'; // Green
            else fill = '#3b82f6'; // Blue
        }

        dots.push(
            <circle key={i} cx={`${x}%`} cy={`${y}%`} r="2" fill={fill} />
        );
    }

    return <g>{dots}</g>;
};

export const ColorLesson: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [objectColor, setObjectColor] = useState<Color>('red');
    const [paperColor, setPaperColor] = useState<Color>('white');
    const [cellophane, setCellophane] = useState<Cellophane>('none');
    const [perceivedColor, setPerceivedColor] = useState<Color>('red');
    const [perceivedPaperColor, setPerceivedPaperColor] = useState<Color>('white');

    // Physics Logic
    useEffect(() => {
        // Helper to calculate perceived color
        const calculatePerceivedColor = (baseColor: Color, cello: Cellophane): Color => {
            // 1. Incident Light (White) -> Cellophane Filter
            let r = true, g = true, b = true;
            if (cello === 'red') { g = false; b = false; }
            if (cello === 'blue') { r = false; g = false; }

            // 2. Filtered Light -> Object Reflection
            let refR = false, refG = false, refB = false;
            if (baseColor === 'white') { refR = r; refG = g; refB = b; }
            if (baseColor === 'red') { refR = r; }
            if (baseColor === 'blue') { refB = b; }
            if (baseColor === 'black') { /* reflects nothing */ }

            // 3. Reflected Light -> Cellophane Filter (Again)
            if (cello === 'red') { refG = false; refB = false; }
            if (cello === 'blue') { refR = false; refG = false; }

            // 4. Result
            if (refR && refG && refB) return 'white';
            if (refR && !refG && !refB) return 'red';
            if (!refR && !refG && refB) return 'blue';
            return 'black';
        };

        setPerceivedColor(calculatePerceivedColor(objectColor, cellophane));
        setPerceivedPaperColor(calculatePerceivedColor(paperColor, cellophane));

    }, [objectColor, paperColor, cellophane]);

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
                <h1 className="text-xl font-bold text-slate-800">色の見え方</h1>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Setup & Diagram */}
                <div className="w-1/2 border-r border-slate-200 bg-white p-8 flex flex-col gap-8 overflow-hidden">

                    {/* Controls */}
                    <div className="space-y-4">
                        {/* Cellophane */}
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-sm font-medium text-slate-700">セロハン</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCellophane('none')}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 flex items-center justify-center text-[10px] font-bold text-slate-500",
                                        cellophane === 'none' ? "ring-2 ring-offset-1 ring-indigo-500 border-slate-300 bg-white" : "border-slate-200 bg-white"
                                    )}
                                >
                                    なし
                                </button>
                                <button
                                    onClick={() => setCellophane('red')}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 opacity-80",
                                        cellophane === 'red' ? "ring-2 ring-offset-1 ring-indigo-500 border-red-600 bg-red-500" : "border-red-200 bg-red-500"
                                    )}
                                />
                                <button
                                    onClick={() => setCellophane('blue')}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 opacity-80",
                                        cellophane === 'blue' ? "ring-2 ring-offset-1 ring-indigo-500 border-blue-600 bg-blue-500" : "border-blue-200 bg-blue-500"
                                    )}
                                />
                            </div>
                        </div>

                        {/* Paper */}
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-sm font-medium text-slate-700">画用紙の色</label>
                            <div className="flex gap-2">
                                {(['white', 'red', 'blue', 'black'] as Color[]).map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setPaperColor(c)}
                                        className={cn(
                                            "w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110",
                                            paperColor === c ? "ring-2 ring-offset-1 ring-indigo-500 border-transparent" : "border-slate-200",
                                            c === 'white' ? "bg-white" : "",
                                            c === 'red' ? "bg-red-500" : "",
                                            c === 'blue' ? "bg-blue-500" : "",
                                            c === 'black' ? "bg-slate-900" : ""
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Apple */}
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-sm font-medium text-slate-700">りんごの色</label>
                            <div className="flex gap-2">
                                {(['white', 'red', 'blue', 'black'] as Color[]).map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setObjectColor(c)}
                                        className={cn(
                                            "w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110",
                                            objectColor === c ? "ring-2 ring-offset-1 ring-indigo-500 border-transparent" : "border-slate-200",
                                            c === 'white' ? "bg-white" : "",
                                            c === 'red' ? "bg-red-500" : "",
                                            c === 'blue' ? "bg-blue-500" : "",
                                            c === 'black' ? "bg-slate-900" : ""
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Diagram Container */}
                    <div className="flex-1 w-full bg-slate-50 rounded-2xl border border-slate-200 relative min-h-[400px] overflow-hidden flex items-center justify-center">

                        {/* Light Source */}
                        <div className="absolute top-[10%] left-[10%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-50">
                            <Sun className="w-10 h-10 text-orange-400" />
                        </div>

                        {/* Eye */}
                        <div className="absolute top-[10%] right-[10%] translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-50">
                            <Eye className="w-10 h-10 text-slate-700" />
                        </div>

                        {/* 3D Scene Container */}
                        <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">

                            {/* Group: Paper + Apple + Cellophane */}
                            <div className="relative transform-style-3d rotate-x-60 translate-y-20">

                                {/* Cellophane (Floating Layer) */}
                                {cellophane !== 'none' && (
                                    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-48 z-20 pointer-events-none">
                                        <div className={cn(
                                            "w-full h-full rounded-xl opacity-50 border-2 transition-colors duration-300",
                                            cellophane === 'red' ? "bg-red-500 border-red-400" : "bg-blue-500 border-blue-400"
                                        )}></div>
                                    </div>
                                )}

                                {/* Paper (Base Layer) */}
                                <div className={cn(
                                    "w-80 h-60 rounded-3xl shadow-2xl flex items-center justify-center transition-colors duration-300 relative z-10",
                                    paperColor === 'white' ? "bg-white" : "",
                                    paperColor === 'red' ? "bg-red-500" : "",
                                    paperColor === 'blue' ? "bg-blue-500" : "",
                                    paperColor === 'black' ? "bg-slate-900" : ""
                                )}>
                                    {/* Apple */}
                                    <div className={cn(
                                        "w-24 h-24 flex items-center justify-center transition-colors duration-300",
                                        objectColor === 'white' ? "text-slate-200" : "",
                                        objectColor === 'red' ? "text-red-500" : "",
                                        objectColor === 'blue' ? "text-blue-500" : "",
                                        objectColor === 'black' ? "text-slate-900" : ""
                                    )}>
                                        <Apple className="w-full h-full fill-current drop-shadow-lg pb-2" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rays (SVG Overlay - Screen Space) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-40">
                            {/* 
                                    Coordinates:
                                    Sun: (10%, 10%)
                                    Object: (50%, 60%)
                                    Eye: (90%, 10%)
                                    Cellophane Plane Y: 35%
                                    
                                    Intersections (Linear Interpolation):
                                    1. Sun->Object at Y=35%:
                                       t = (35-10)/(60-10) = 0.5
                                       x = 10 + (50-10)*0.5 = 30%
                                       -> (30%, 35%)
                                    
                                    2. Object->Eye at Y=35%:
                                       t = (35-60)/(10-60) = 0.5
                                       x = 50 + (90-50)*0.5 = 70%
                                       -> (70%, 35%)
                                */}

                            {/* Sun -> Cellophane */}
                            <Ray
                                start={{ x: 10, y: 10 }}
                                end={{ x: 26.4, y: 35 }}
                                type="rgb"
                            />

                            {/* Cellophane -> Object */}
                            <Ray
                                start={{ x: 26.4, y: 35 }}
                                end={{ x: 50, y: 71 }}
                                type={cellophane === 'none' ? 'rgb' : cellophane}
                            />

                            {/* Object -> Cellophane (Reflected) */}
                            <Ray
                                start={{ x: 50, y: 71 }}
                                end={{ x: 73.6, y: 35 }}
                                type={perceivedColor === 'black' ? 'none' : perceivedColor === 'white' ? 'rgb' : perceivedColor}
                            />

                            {/* Cellophane -> Eye */}
                            <Ray
                                start={{ x: 73.6, y: 35 }}
                                end={{ x: 90, y: 10 }}
                                type={perceivedColor === 'black' ? 'none' : perceivedColor === 'white' ? 'rgb' : perceivedColor}
                            />

                            {/* --- Paper Rays --- */}

                            {/* Sun -> Cellophane (Paper Path) */}
                            <Ray
                                start={{ x: 10, y: 10 }}
                                end={{ x: 30.4, y: 35 }}
                                type="rgb"
                            />

                            {/* Cellophane -> Paper (Closer to apple) */}
                            <Ray
                                start={{ x: 30.4, y: 35 }}
                                end={{ x: 50, y: 59 }}
                                type={cellophane === 'none' ? 'rgb' : cellophane}
                            />

                            {/* Paper -> Cellophane (Reflected) */}
                            <Ray
                                start={{ x: 50, y: 59 }}
                                end={{ x: 69.6, y: 35 }}
                                type={perceivedPaperColor === 'black' ? 'none' : perceivedPaperColor === 'white' ? 'rgb' : perceivedPaperColor}
                            />

                            {/* Cellophane -> Eye (Paper Path) */}
                            <Ray
                                start={{ x: 69.6, y: 35 }}
                                end={{ x: 90, y: 10 }}
                                type={perceivedPaperColor === 'black' ? 'none' : perceivedPaperColor === 'white' ? 'rgb' : perceivedPaperColor}
                            />
                        </svg>
                    </div>
                </div>

                {/* Right Panel: Preview */}
                <div className="w-1/2 bg-white p-8 border-l border-slate-200 flex flex-col gap-8 overflow-hidden">
                    {/* Spacer to align with Controls */}
                    <div className="space-y-4 invisible" aria-hidden="true">
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-sm font-medium">Dummy</label>
                            <div className="h-8 w-8"></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-sm font-medium">Dummy</label>
                            <div className="h-8 w-8"></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-sm font-medium">Dummy</label>
                            <div className="h-8 w-8"></div>
                        </div>
                    </div>

                    {/* Preview Container */}
                    <div className="flex-1 w-full bg-slate-50 rounded-2xl border border-slate-200 relative min-h-[400px] overflow-hidden flex items-center justify-center">
                        <div className={cn(
                            "w-full max-w-md aspect-[4/3] rounded-xl shadow-lg flex items-center justify-center transition-colors duration-500 relative overflow-hidden",
                            perceivedPaperColor === 'white' ? "bg-white" : "",
                            perceivedPaperColor === 'red' ? "bg-red-500" : "",
                            perceivedPaperColor === 'blue' ? "bg-blue-500" : "",
                            perceivedPaperColor === 'black' ? "bg-slate-900" : ""
                        )}>
                            <div className={cn(
                                perceivedPaperColor === 'red' ? "bg-red-500" : "",
                                perceivedPaperColor === 'blue' ? "bg-blue-500" : "",
                                perceivedPaperColor === 'black' ? "bg-slate-900" : ""
                            )}>
                                <div className={cn(
                                    "w-32 h-32 flex items-center justify-center transition-colors duration-500",
                                    perceivedColor === 'white' ? "text-slate-200" : "",
                                    perceivedColor === 'red' ? "text-red-500" : "",
                                    perceivedColor === 'blue' ? "text-blue-500" : "",
                                    perceivedColor === 'black' ? "text-slate-900" : ""
                                )}>
                                    <Apple className="w-full h-full fill-current drop-shadow-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
