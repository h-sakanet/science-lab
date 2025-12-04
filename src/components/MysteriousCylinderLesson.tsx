import React, { useState } from 'react';
import { ArrowLeft, Star, TreePine, Eye } from 'lucide-react';

interface MysteriousCylinderLessonProps {
    onBack: () => void;
}

export const MysteriousCylinderLesson: React.FC<MysteriousCylinderLessonProps> = ({ onBack }) => {
    const [currentProblem, setCurrentProblem] = useState<number>(1);
    const [topMirror, setTopMirror] = useState<'horizontal' | 'vertical' | 'back_slash' | 'slash' | null>(null);
    const [bottomMirror, setBottomMirror] = useState<'horizontal' | 'vertical' | 'back_slash' | 'slash' | null>(null);
    const [showStarLight, setShowStarLight] = useState(false);
    const [showTreeLight, setShowTreeLight] = useState(false);

    const [showTopImage, setShowTopImage] = useState(false);
    const [showBottomImage, setShowBottomImage] = useState(false);

    const problems = [1, 2, 3, 4, 5];

    // Calculate ray path
    const calculateRayPath = (startY: number, color: string) => {
        const path: React.ReactNode[] = [];
        let currentX = 70;
        let currentY = startY;
        let dirX = 1; // 1: right, -1: left, 0: none
        let dirY = 0; // 1: down, -1: up, 0: none

        // Segment 1: Move Right
        let nextX = 260; // Default wall
        let hitMirror = false;
        let nextDirX = 0;
        let nextDirY = 0;

        if (topMirror === 'vertical') {
            nextX = 250;
            hitMirror = true;
            nextDirX = -1; // Reflect Left
        } else if (topMirror === 'back_slash') {
            // y = x - 160 => x = y + 160
            nextX = currentY + 160;
            hitMirror = true;
            nextDirX = 0;
            nextDirY = 1; // Reflect Down
        } else if (topMirror === 'slash') {
            // y = -x + 280 => x = 280 - y
            nextX = 280 - currentY;
            hitMirror = true;
            nextDirX = 0;
            nextDirY = -1; // Reflect Up
        }

        path.push(
            <line key="seg1" x1={currentX} y1={currentY} x2={nextX} y2={currentY} stroke={color} strokeWidth="2" />
        );

        if (!hitMirror) return path;

        currentX = nextX;
        dirX = nextDirX;
        dirY = nextDirY;

        // Segment 2
        if (dirX === -1) {
            // Going Left (from vertical mirror)
            path.push(
                <line key="seg2" x1={currentX} y1={currentY} x2={70} y2={currentY} stroke={color} strokeWidth="2" />
            );
            return path;
        } else if (dirY === -1) {
            // Going Up (from slash mirror)
            path.push(
                <line key="seg2" x1={currentX} y1={currentY} x2={currentX} y2={20} stroke={color} strokeWidth="2" />
            );
            return path;
        } else if (dirY === 1) {
            // Going Down (from back_slash mirror)
            let nextY = 280; // Default bottom wall
            let hitBottomMirror = false;
            let bottomNextDirX = 0;
            let bottomNextDirY = 0;

            if (bottomMirror === 'horizontal') {
                nextY = 270;
                hitBottomMirror = true;
                bottomNextDirX = 0;
                bottomNextDirY = -1; // Reflect Up
            } else if (bottomMirror === 'back_slash') {
                // y = x + 20
                nextY = currentX + 20;
                hitBottomMirror = true;
                bottomNextDirX = 1; // Reflect Right
                bottomNextDirY = 0;
            } else if (bottomMirror === 'slash') {
                // y = -x + 460
                nextY = -currentX + 460;
                hitBottomMirror = true;
                bottomNextDirX = -1; // Reflect Left
                bottomNextDirY = 0;
            }

            path.push(
                <line key="seg2" x1={currentX} y1={currentY} x2={currentX} y2={nextY} stroke={color} strokeWidth="2" />
            );

            if (!hitBottomMirror) return path;

            currentY = nextY;
            dirX = bottomNextDirX;
            dirY = bottomNextDirY;

            // Segment 3
            if (dirY === -1) {
                // Going Up (from horizontal mirror)
                path.push(
                    <line key="seg3" x1={currentX} y1={currentY} x2={currentX} y2={currentY - 100} stroke={color} strokeWidth="2" /> // Just go up some amount
                );
            } else if (dirX === 1) {
                // Going Right
                path.push(
                    <line key="seg3" x1={currentX} y1={currentY} x2={260} y2={currentY} stroke={color} strokeWidth="2" />
                );
            } else if (dirX === -1) {
                // Going Left
                path.push(
                    <line key="seg3" x1={currentX} y1={currentY} x2={70} y2={currentY} stroke={color} strokeWidth="2" />
                );
            }
        }

        return path;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">ふしぎなつつ</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-6 gap-6">

                {/* Problem Menu */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 flex gap-2 overflow-x-auto">
                    {problems.map((num) => (
                        <button
                            key={num}
                            onClick={() => setCurrentProblem(num)}
                            className={`px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 ${currentProblem === num
                                ? 'bg-green-500 text-white shadow-sm'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            問題 {num}
                        </button>
                    ))}
                </div>

                {/* Problem Area */}
                {currentProblem === 1 ? (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row">

                        {/* Left Panel: Side View */}
                        <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col bg-slate-50/50 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                            <p className="text-sm font-bold text-slate-600 text-center mb-4">横から見た様子</p>
                            <div className="flex-1 flex items-center justify-center relative py-12">

                                {/* Drawing Container */}
                                <div className="relative w-[280px] h-[300px]">

                                    {/* Light Toggles */}
                                    <div className="absolute top-[20px] -left-20 flex flex-col gap-2">
                                        <button
                                            onClick={() => setShowStarLight(!showStarLight)}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${showStarLight ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                        >
                                            星の光
                                        </button>
                                        <button
                                            onClick={() => setShowTreeLight(!showTreeLight)}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${showTreeLight ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                        >
                                            木の光
                                        </button>
                                    </div>

                                    {/* Top Mirror Selection Panel */}
                                    <div className="absolute -top-16 right-0 bg-white rounded-full shadow-md border border-slate-200 p-2 flex gap-2 z-20">
                                        {/* None */}
                                        <button
                                            onClick={() => setTopMirror(null)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${topMirror === null ? 'bg-slate-100 ring-2 ring-green-500' : ''}`}
                                        >
                                            <span className="text-xs font-bold text-slate-400">なし</span>
                                        </button>
                                        {/* Horizontal */}
                                        <button
                                            onClick={() => setTopMirror('horizontal')}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${topMirror === 'horizontal' ? 'bg-slate-100 ring-2 ring-green-500' : ''}`}
                                        >
                                            <div className="w-6 h-0.5 bg-slate-800"></div>
                                        </button>
                                        {/* Vertical */}
                                        <button
                                            onClick={() => setTopMirror('vertical')}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${topMirror === 'vertical' ? 'bg-slate-100 ring-2 ring-green-500' : ''}`}
                                        >
                                            <div className="w-0.5 h-6 bg-slate-800"></div>
                                        </button>
                                        {/* Back Slash (\) */}
                                        <button
                                            onClick={() => setTopMirror('back_slash')}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${topMirror === 'back_slash' ? 'bg-slate-100 ring-2 ring-green-500' : ''}`}
                                        >
                                            <div className="w-6 h-0.5 bg-slate-800 rotate-45"></div>
                                        </button>
                                        {/* Slash (/) */}
                                        <button
                                            onClick={() => setTopMirror('slash')}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${topMirror === 'slash' ? 'bg-slate-100 ring-2 ring-green-500' : ''}`}
                                        >
                                            <div className="w-6 h-0.5 bg-slate-800 -rotate-45"></div>
                                        </button>

                                        {/* Triangle pointer */}
                                        <div className="absolute -bottom-2 right-12 w-4 h-4 bg-white border-b border-r border-slate-200 transform rotate-45"></div>
                                    </div>

                                    {/* Bottom Mirror Selection Panel */}
                                    <div className="absolute -bottom-16 right-0 bg-white rounded-full shadow-md border border-slate-200 p-2 flex gap-2 z-20">
                                        {/* Triangle pointer (pointing up) */}
                                        <div className="absolute -top-2 right-12 w-4 h-4 bg-white border-t border-l border-slate-200 transform rotate-45"></div>

                                        {/* None */}
                                        <button
                                            onClick={() => setBottomMirror(null)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${bottomMirror === null ? 'bg-slate-100 ring-2 ring-green-500' : ''}`}
                                        >
                                            <span className="text-xs font-bold text-slate-400">なし</span>
                                        </button>
                                        {/* Horizontal */}
                                        <button
                                            onClick={() => setBottomMirror('horizontal')}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${bottomMirror === 'horizontal' ? 'bg-slate-100 ring-2 ring-green-500' : ''}`}
                                        >
                                            <div className="w-6 h-0.5 bg-slate-800"></div>
                                        </button>
                                        {/* Vertical */}
                                        <button
                                            onClick={() => setBottomMirror('vertical')}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${bottomMirror === 'vertical' ? 'bg-slate-100 ring-2 ring-green-500' : ''}`}
                                        >
                                            <div className="w-0.5 h-6 bg-slate-800"></div>
                                        </button>
                                        {/* Back Slash (\) */}
                                        <button
                                            onClick={() => setBottomMirror('back_slash')}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${bottomMirror === 'back_slash' ? 'bg-slate-100 ring-2 ring-green-500' : ''}`}
                                        >
                                            <div className="w-6 h-0.5 bg-slate-800 rotate-45"></div>
                                        </button>
                                        {/* Slash (/) */}
                                        <button
                                            onClick={() => setBottomMirror('slash')}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${bottomMirror === 'slash' ? 'bg-slate-100 ring-2 ring-green-500' : ''}`}
                                        >
                                            <div className="w-6 h-0.5 bg-slate-800 -rotate-45"></div>
                                        </button>
                                    </div>

                                    {/* Cylinder (Side View) */}
                                    <svg width="100%" height="100%" viewBox="0 0 280 300" className="absolute top-0 left-0 pointer-events-none">
                                        {/* Outer Line */}
                                        <path
                                            d="M 80,20 L 260,20 L 260,280 L 80,280"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="text-slate-400"
                                        />
                                        {/* Inner Line */}
                                        <path
                                            d="M 80,100 L 180,100 L 180,200 L 80,200"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="text-slate-400"
                                        />
                                        {/* Dashed lines for openings */}
                                        <line x1="80" y1="20" x2="80" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-300" />
                                        <line x1="80" y1="200" x2="80" y2="280" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-300" />

                                        {/* Light Rays */}
                                        {showStarLight && calculateRayPath(40, '#facc15')}
                                        {showTreeLight && calculateRayPath(80, '#16a34a')}

                                        {/* Top Mirror Rendering */}
                                        {topMirror === 'horizontal' && (
                                            <line x1="180" y1="30" x2="250" y2="30" stroke="#64748b" strokeWidth="4" />
                                        )}
                                        {topMirror === 'vertical' && (
                                            <line x1="250" y1="30" x2="250" y2="90" stroke="#64748b" strokeWidth="4" />
                                        )}
                                        {topMirror === 'back_slash' && (
                                            <line x1="190" y1="30" x2="250" y2="90" stroke="#64748b" strokeWidth="4" />
                                        )}
                                        {topMirror === 'slash' && (
                                            <line x1="190" y1="90" x2="250" y2="30" stroke="#64748b" strokeWidth="4" />
                                        )}

                                        {/* Bottom Mirror Rendering */}
                                        {bottomMirror === 'horizontal' && (
                                            <line x1="180" y1="270" x2="250" y2="270" stroke="#64748b" strokeWidth="4" />
                                        )}
                                        {bottomMirror === 'vertical' && (
                                            <line x1="250" y1="200" x2="250" y2="270" stroke="#64748b" strokeWidth="4" />
                                        )}
                                        {bottomMirror === 'back_slash' && (
                                            <line x1="190" y1="210" x2="250" y2="270" stroke="#64748b" strokeWidth="4" />
                                        )}
                                        {bottomMirror === 'slash' && (
                                            <line x1="190" y1="270" x2="250" y2="210" stroke="#64748b" strokeWidth="4" />
                                        )}
                                    </svg>

                                    {/* Object (Tree Card) at Top Opening */}
                                    <div className="absolute top-[25px] left-0 w-[70px] h-[80px] border-2 border-slate-300 bg-white rounded-md flex flex-col items-center justify-center shadow-sm">
                                        <div className="relative">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -top-1 left-1/2 -translate-x-1/2" />
                                            <TreePine className="w-12 h-12 text-green-600" />
                                        </div>
                                    </div>

                                    {/* Eye at Bottom Opening */}
                                    <div className="absolute bottom-[20px] left-0 w-[70px] h-[80px] flex items-center justify-center">
                                        <Eye className="w-8 h-8 text-slate-900" />
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Front View */}
                        <div className="flex-1 p-6 flex flex-col bg-white rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
                            <p className="text-sm font-bold text-slate-600 text-center mb-4">正面から見た様子</p>
                            <div className="flex-1 flex items-center justify-center relative">
                                <div className="relative w-[200px] h-[300px]">
                                    {/* Cylinder Body (Front View) */}
                                    <div className="absolute top-[20px] left-[50px] w-[100px] h-[260px] border-2 border-slate-400 bg-slate-50">
                                        {/* Lines indicating openings */}
                                        <div className="absolute top-[80px] left-0 w-full border-t border-slate-400"></div>
                                        <div className="absolute top-[180px] left-0 w-full border-t border-slate-400"></div>

                                        {/* Top Mirror (Front View) */}
                                        {topMirror === 'horizontal' && (
                                            <div className="absolute top-[10px] left-[10px] w-[80px] h-[4px] bg-slate-500"></div>
                                        )}
                                        {topMirror === 'vertical' && (
                                            <div className="absolute top-[10px] left-[10px] w-[80px] h-[60px] bg-slate-100 border-4 border-slate-500"></div>
                                        )}
                                        {topMirror === 'back_slash' && (
                                            <svg className="absolute top-[10px] left-[10px] w-[80px] h-[60px] overflow-visible">
                                                <polygon points="0,0 80,0 76,60 4,60" fill="#f1f5f9" stroke="#64748b" strokeWidth="4" />
                                            </svg>
                                        )}
                                        {topMirror === 'slash' && (
                                            <svg className="absolute top-[10px] left-[10px] w-[80px] h-[60px] overflow-visible">
                                                <polygon points="4,0 76,0 80,60 0,60" fill="#f1f5f9" stroke="#64748b" strokeWidth="4" />
                                            </svg>
                                        )}

                                        {/* Bottom Mirror (Front View) */}
                                        {bottomMirror === 'horizontal' && (
                                            <div className="absolute bottom-[10px] left-[10px] w-[80px] h-[4px] bg-slate-500"></div>
                                        )}
                                        {bottomMirror === 'vertical' && (
                                            <div className="absolute bottom-[10px] left-[10px] w-[80px] h-[60px] bg-slate-100 border-4 border-slate-500"></div>
                                        )}
                                        {bottomMirror === 'back_slash' && (
                                            <svg className="absolute bottom-[10px] left-[10px] w-[80px] h-[60px] overflow-visible">
                                                <polygon points="0,0 80,0 76,60 4,60" fill="#f1f5f9" stroke="#64748b" strokeWidth="4" />
                                            </svg>
                                        )}
                                        {bottomMirror === 'slash' && (
                                            <svg className="absolute bottom-[10px] left-[10px] w-[80px] h-[60px] overflow-visible">
                                                <polygon points="4,0 76,0 80,60 0,60" fill="#f1f5f9" stroke="#64748b" strokeWidth="4" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Image Toggles */}
                                    <div className="absolute top-[45px] left-[160px] flex flex-col gap-2">
                                        <button
                                            onClick={() => setShowTopImage(!showTopImage)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${showTopImage ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                        >
                                            像を表示
                                        </button>
                                    </div>
                                    <div className="absolute top-[225px] left-[160px] flex flex-col gap-2">
                                        <button
                                            onClick={() => setShowBottomImage(!showBottomImage)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${showBottomImage ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                        >
                                            像を表示
                                        </button>
                                    </div>

                                    {/* Object (Top View) - Visible for vertical and slash/back_slash mirrors AND showTopImage is true */}
                                    {showTopImage && (topMirror === 'vertical' || topMirror === 'slash' || topMirror === 'back_slash') && (
                                        <div className="absolute top-[25px] left-[65px] w-[70px] h-[80px] flex flex-col items-center justify-center z-10">
                                            <div className="relative">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -top-1 left-1/2 -translate-x-1/2" />
                                                <TreePine className="w-12 h-12 text-green-600" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Object (Bottom View) - Visible only when Top is back_slash and Bottom is slash AND showBottomImage is true */}
                                    {showBottomImage && topMirror === 'back_slash' && bottomMirror === 'slash' && (
                                        <div className="absolute top-[195px] left-[65px] w-[70px] h-[80px] flex flex-col items-center justify-center z-10">
                                            <div className="relative rotate-180">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -top-1 left-1/2 -translate-x-1/2" />
                                                <TreePine className="w-12 h-12 text-green-600" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* Placeholder for other problems */
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-slate-400 font-medium">問題 {currentProblem} は準備中です</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
