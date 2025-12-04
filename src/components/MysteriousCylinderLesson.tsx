import React, { useState } from 'react';
import { ArrowLeft, Star, TreePine, Eye, RotateCcw } from 'lucide-react';

interface MysteriousCylinderLessonProps {
    onBack: () => void;
}

export const MysteriousCylinderLesson: React.FC<MysteriousCylinderLessonProps> = ({ onBack }) => {
    type MirrorType = 'horizontal' | 'vertical' | 'back_slash' | 'slash' | null;

    interface ProblemState {
        topMirror: MirrorType;
        bottomMirror: MirrorType;
        showStarLight: boolean;
        showTreeLight: boolean;
        showTopImage: boolean;
        showBottomImage: boolean;
        showMirrors: boolean;
        // Problem 3 Right Panel States
        showRightMirrors: boolean;
        showRightStarLight: boolean;
        showRightTreeLight: boolean;
        showRightImage: boolean;
    }

    const [currentProblem, setCurrentProblem] = useState<number>(1);

    const initialProblemState: ProblemState = {
        topMirror: null,
        bottomMirror: null,
        showStarLight: false,
        showTreeLight: false,
        showTopImage: false,
        showBottomImage: false,
        showMirrors: false,
        showRightMirrors: false,
        showRightStarLight: false,
        showRightTreeLight: false,
        showRightImage: false
    };

    const [problemStates, setProblemStates] = useState<Record<number, ProblemState>>({
        1: { ...initialProblemState },
        2: { ...initialProblemState },
        3: { ...initialProblemState },
        4: { ...initialProblemState },
        5: { ...initialProblemState },
    });

    const currentState = problemStates[currentProblem];
    const {
        topMirror, bottomMirror, showStarLight, showTreeLight, showTopImage, showBottomImage, showMirrors,
        showRightMirrors, showRightStarLight, showRightTreeLight, showRightImage
    } = currentState;

    const updateState = (key: keyof ProblemState, value: any) => {
        setProblemStates(prev => ({
            ...prev,
            [currentProblem]: {
                ...prev[currentProblem],
                [key]: value
            }
        }));
    };

    const setTopMirror = (val: MirrorType) => updateState('topMirror', val);
    const setBottomMirror = (val: MirrorType) => updateState('bottomMirror', val);
    const setShowStarLight = (val: boolean) => updateState('showStarLight', val);
    const setShowTreeLight = (val: boolean) => updateState('showTreeLight', val);
    const setShowTopImage = (val: boolean) => updateState('showTopImage', val);
    const setShowBottomImage = (val: boolean) => updateState('showBottomImage', val);
    const setShowMirrors = (val: boolean) => {
        setProblemStates(prev => ({
            ...prev,
            [currentProblem]: {
                ...prev[currentProblem],
                showMirrors: val,
                showStarLight: val ? prev[currentProblem].showStarLight : false,
                showTreeLight: val ? prev[currentProblem].showTreeLight : false
            }
        }));
    };

    // Right Panel Setters
    const setShowRightImage = (val: boolean) => updateState('showRightImage', val);
    const setShowRightMirrors = (val: boolean) => {
        setProblemStates(prev => ({
            ...prev,
            [currentProblem]: {
                ...prev[currentProblem],
                showRightMirrors: val,
                showRightStarLight: val ? prev[currentProblem].showRightStarLight : false,
                showRightTreeLight: val ? prev[currentProblem].showRightTreeLight : false
            }
        }));
    };
    const setShowRightStarLight = (val: boolean) => updateState('showRightStarLight', val);
    const setShowRightTreeLight = (val: boolean) => updateState('showRightTreeLight', val);

    const resetLeftPanel = () => {
        setProblemStates(prev => {
            const current = prev[currentProblem];
            const updates: Partial<ProblemState> = {};

            if (currentProblem === 3) {
                updates.showMirrors = initialProblemState.showMirrors;
                updates.showStarLight = initialProblemState.showStarLight;
                updates.showTreeLight = initialProblemState.showTreeLight;
                updates.showBottomImage = initialProblemState.showBottomImage;
            } else {
                updates.topMirror = initialProblemState.topMirror;
                updates.bottomMirror = initialProblemState.bottomMirror;
                updates.showStarLight = initialProblemState.showStarLight;
                updates.showTreeLight = initialProblemState.showTreeLight;
            }

            return {
                ...prev,
                [currentProblem]: { ...current, ...updates }
            };
        });
    };

    const resetRightPanel = () => {
        setProblemStates(prev => {
            const current = prev[currentProblem];
            const updates: Partial<ProblemState> = {};

            if (currentProblem === 3) {
                updates.showRightMirrors = initialProblemState.showRightMirrors;
                updates.showRightStarLight = initialProblemState.showRightStarLight;
                updates.showRightTreeLight = initialProblemState.showRightTreeLight;
                updates.showRightImage = initialProblemState.showRightImage;
            } else {
                updates.showTopImage = initialProblemState.showTopImage;
                updates.showBottomImage = initialProblemState.showBottomImage;
            }

            return {
                ...prev,
                [currentProblem]: { ...current, ...updates }
            };
        });
    };

    const problems = [1, 2, 3, 4, 5];

    // Calculate ray path
    const calculateRayPath = (startY: number, color: string, isRightPanel: boolean = false) => {
        const path: React.ReactNode[] = [];

        if (currentProblem === 3) {
            if (isRightPanel) {
                // Problem 3 Right Panel: Right -> Left -> Down -> Forward
                const startX = 240;
                // Mirror equation: line from (50,30) to (110,90) => y = -x + 140 => x = 140 - y
                const reflectionX = 140 - startY;

                // Segment 1: Right to Left (Mirror 1)
                path.push(
                    <line key="seg1" x1={startX} y1={startY} x2={reflectionX} y2={startY} stroke={color} strokeWidth="2" />
                );

                // Segment 2: Down (Mirror 2)
                path.push(
                    <line key="seg2" x1={reflectionX} y1={startY} x2={reflectionX} y2={240} stroke={color} strokeWidth="2" />
                );

                return path;
            } else {
                // Problem 3 Left Panel: Left -> Right -> Down -> Forward (Stop)
                const startX = 60;
                // Mirror equation: line from (190,30) to (250,90) => y = x - 160 => x = y + 160
                const reflectionX = startY + 160;

                // Segment 1: Left to Right (Mirror 1)
                path.push(
                    <line key="seg1" x1={startX} y1={startY} x2={reflectionX} y2={startY} stroke={color} strokeWidth="2" />
                );

                // Segment 2: Down (Mirror 2 at y=230)
                path.push(
                    <line key="seg2" x1={reflectionX} y1={startY} x2={reflectionX} y2={240} stroke={color} strokeWidth="2" />
                );

                return path;
            }
        }

        // Problem 1 & 2 Logic
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
                // CORRECT LOGIC based on previous context:
                // If bottomMirror is slash (/), and coming down:
                // Reflects LEFT.
                hitBottomMirror = true;
                bottomNextDirX = -1;
                bottomNextDirY = 0;
            }

            path.push(
                <line key="seg2" x1={currentX} y1={currentY} x2={currentX} y2={nextY} stroke={color} strokeWidth="2" />
            );

            if (!hitBottomMirror) return path;

            currentX = currentX; // X stays same
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
                const limitX = currentProblem === 2 ? 420 : 260;
                path.push(
                    <line key="seg3" x1={currentX} y1={currentY} x2={limitX} y2={currentY} stroke={color} strokeWidth="2" />
                );
            } else if (dirX === -1) {
                // Going Left
                const limitX = currentProblem === 2 ? 180 : 70;
                path.push(
                    <line key="seg3" x1={currentX} y1={currentY} x2={limitX} y2={currentY} stroke={color} strokeWidth="2" />
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
                {currentProblem === 1 || currentProblem === 2 ? (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row">

                        {/* Left Panel: Side View */}
                        <div className="flex-1 md:flex-[1.5] border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col bg-slate-50/50 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                            <p className="text-sm font-bold text-slate-600 text-center mb-4">横から見た様子</p>
                            <div className="flex-1 flex items-center justify-center relative py-12">

                                {/* Drawing Container */}
                                <div className={`relative ${currentProblem === 2 ? 'w-[420px]' : 'w-[280px]'} h-[300px]`}>

                                    {/* Light Toggles */}
                                    <div className="absolute top-[25px] -left-20 flex flex-col gap-2">
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
                                    <div className={`absolute -top-16 ${currentProblem === 2 ? 'left-[10px]' : 'right-0'} bg-white rounded-full shadow-md border border-slate-200 p-2 flex gap-2 z-20`}>
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
                                    <div className={`absolute -bottom-16 ${currentProblem === 2 ? 'left-[10px]' : 'right-0'} bg-white rounded-full shadow-md border border-slate-200 p-2 flex gap-2 z-20`}>
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
                                    <svg width="100%" height="100%" viewBox={currentProblem === 2 ? "0 0 450 300" : "0 0 280 300"} className="absolute top-0 left-0 pointer-events-none">
                                        {currentProblem === 1 ? (
                                            <>
                                                {/* Problem 1: U-shape */}
                                                <path
                                                    d="M 80,20 L 260,20 L 260,280 L 80,280"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="text-slate-400"
                                                />
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
                                            </>
                                        ) : (
                                            <>
                                                {/* Problem 2: S-shape */}
                                                {/* Upper Wall */}
                                                <path d="M 80,20 L 260,20 L 260,200 L 420,200" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                                                {/* Lower Wall */}
                                                <path d="M 80,100 L 180,100 L 180,280 L 420,280" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                                                {/* Openings */}
                                                <line x1="80" y1="20" x2="80" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-300" />
                                                <line x1="420" y1="200" x2="420" y2="280" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-300" />
                                            </>
                                        )}


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

                                    {/* Eye */}
                                    {currentProblem === 1 ? (
                                        <div className="absolute bottom-[20px] left-0 w-[70px] h-[80px] flex items-center justify-center">
                                            <Eye className="w-8 h-8 text-slate-900" />
                                        </div>
                                    ) : (
                                        <div className="absolute bottom-[20px] -right-10 w-[70px] h-[80px] flex items-center justify-center">
                                            <Eye className="w-8 h-8 text-slate-900" />
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Front/Right View */}
                        <div className="flex-1 p-6 flex flex-col bg-white rounded-b-xl md:rounded-r-xl md:rounded-bl-none relative">
                            <button
                                onClick={resetRightPanel}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                title="リセット"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <p className="text-sm font-bold text-slate-600 text-center mb-4">
                                {currentProblem === 1 ? '正面から見た様子' : '右から見た様子'}
                            </p>
                            <div className="flex-1 flex items-center justify-center relative">
                                <div className="relative w-[200px] h-[300px]">
                                    {/* Cylinder Body (Front View) */}
                                    <div className="absolute top-[20px] left-[50px] w-[100px] h-[260px] border-2 border-slate-400 bg-slate-50">
                                        {/* Lines indicating openings */}
                                        {currentProblem === 1 && (
                                            <div className="absolute top-[80px] left-0 w-full border-t border-slate-400"></div>
                                        )}
                                        <div className="absolute top-[180px] left-0 w-full border-t border-slate-400"></div>

                                        {/* Top Mirror (Front View) - Visible only for Problem 1 */}
                                        {currentProblem === 1 && (
                                            <>
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
                                            </>
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
                                                <polygon
                                                    points={currentProblem === 2 ? "4,0 76,0 80,60 0,60" : "0,0 80,0 76,60 4,60"}
                                                    fill="#f1f5f9"
                                                    stroke="#64748b"
                                                    strokeWidth="4"
                                                />
                                            </svg>
                                        )}
                                        {bottomMirror === 'slash' && (
                                            <svg className="absolute bottom-[10px] left-[10px] w-[80px] h-[60px] overflow-visible">
                                                <polygon
                                                    points={currentProblem === 2 ? "0,0 80,0 76,60 4,60" : "4,0 76,0 80,60 0,60"}
                                                    fill="#f1f5f9"
                                                    stroke="#64748b"
                                                    strokeWidth="4"
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Image Toggles */}
                                    {currentProblem === 1 && (
                                        <div className="absolute top-[45px] left-[160px] flex flex-col gap-2">
                                            <button
                                                onClick={() => setShowTopImage(!showTopImage)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${showTopImage ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                            >
                                                像を表示
                                            </button>
                                        </div>
                                    )}
                                    <div className="absolute top-[225px] left-[160px] flex flex-col gap-2">
                                        <button
                                            onClick={() => setShowBottomImage(!showBottomImage)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${showBottomImage ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                        >
                                            像を表示
                                        </button>
                                    </div>

                                    {/* Object (Top View) - Visible for vertical and slash/back_slash mirrors AND showTopImage is true - ONLY for Problem 1 */}
                                    {currentProblem === 1 && showTopImage && (topMirror === 'vertical' || topMirror === 'slash' || topMirror === 'back_slash') && (
                                        <div className="absolute top-[25px] left-[65px] w-[70px] h-[80px] flex flex-col items-center justify-center z-10">
                                            <div className="relative">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -top-1 left-1/2 -translate-x-1/2" />
                                                <TreePine className="w-12 h-12 text-green-600" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Object (Bottom View) */}
                                    {showBottomImage && (
                                        <>
                                            {/* Problem 1: Top=\, Bottom=/ -> Inverted */}
                                            {currentProblem === 1 && topMirror === 'back_slash' && bottomMirror === 'slash' && (
                                                <div className="absolute top-[195px] left-[65px] w-[70px] h-[80px] flex flex-col items-center justify-center z-10">
                                                    <div className="relative rotate-180">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -top-1 left-1/2 -translate-x-1/2" />
                                                        <TreePine className="w-12 h-12 text-green-600" />
                                                    </div>
                                                </div>
                                            )}
                                            {/* Problem 2: Top=\, Bottom=\ -> Upright */}
                                            {currentProblem === 2 && topMirror === 'back_slash' && bottomMirror === 'back_slash' && (
                                                <div className="absolute top-[200px] left-[65px] w-[70px] h-[80px] flex flex-col items-center justify-center z-10">
                                                    <div className="relative">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -top-1 left-1/2 -translate-x-1/2" />
                                                        <TreePine className="w-12 h-12 text-green-600" />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                ) : currentProblem === 3 ? (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row">
                        {/* Left Panel: Front View (Problem 3) */}
                        <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col bg-slate-50/50 rounded-t-xl md:rounded-l-xl md:rounded-tr-none relative">
                            <button
                                onClick={resetLeftPanel}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                title="リセット"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <p className="text-sm font-bold text-slate-600 text-center mb-4">正面から見た様子</p>
                            <div className="flex-1 flex items-center justify-center relative py-12">
                                <div className="relative w-[300px] h-[300px]">

                                    {/* Mirror Toggle */}
                                    <div className="absolute top-[50px] left-[270px]">
                                        <button
                                            onClick={() => setShowMirrors(!showMirrors)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${showMirrors ? 'bg-slate-100 border-slate-400 text-slate-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                        >
                                            鏡を表示
                                        </button>
                                    </div>

                                    {/* Light Toggles */}
                                    <div className="absolute top-[25px] -left-[60px] flex flex-col gap-2">
                                        <button
                                            onClick={() => setShowStarLight(!showStarLight)}
                                            disabled={!showMirrors}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${showStarLight ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-white border-slate-200 text-slate-500'} ${!showMirrors ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            星の光
                                        </button>
                                        <button
                                            onClick={() => setShowTreeLight(!showTreeLight)}
                                            disabled={!showMirrors}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${showTreeLight ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-slate-200 text-slate-500'} ${!showMirrors ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            木の光
                                        </button>
                                    </div>

                                    {/* Cylinder (Inverted L-shape) */}
                                    <svg width="100%" height="100%" viewBox="0 0 300 300" className="absolute top-0 left-0 pointer-events-none">
                                        {/* Walls */}
                                        <path d="M 100,20 L 260,20 L 260,280 L 180,280 L 180,100 L 100,100" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                                        {/* Opening (Left) */}
                                        <line x1="100" y1="20" x2="100" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-300" />

                                        {/* Opening (Front-Bottom) */}
                                        <line x1="180" y1="200" x2="260" y2="200" stroke="currentColor" strokeWidth="1" className="text-slate-400" />

                                        {/* Mirror 2 (Bottom Right) - Trapezoid */}
                                        {/* Placed before Light Rays so rays appear on top */}
                                        {showMirrors && (
                                            <polygon points="194,220 246,220 252,270 188,270" fill="#f1f5f9" stroke="#64748b" strokeWidth="4" />
                                        )}

                                        {/* Light Rays */}
                                        {showStarLight && calculateRayPath(40, '#facc15')}
                                        {showTreeLight && calculateRayPath(80, '#16a34a')}

                                        {/* Mirror 1 (Top Right Corner) - Back Slash */}
                                        {showMirrors && (
                                            <line x1="190" y1="30" x2="250" y2="90" stroke="#64748b" strokeWidth="4" />
                                        )}
                                    </svg>

                                    {/* Object (Tree Card) at Left Opening */}
                                    <div className="absolute top-[25px] left-[20px] w-[70px] h-[80px] border-2 border-slate-300 bg-white rounded-md flex flex-col items-center justify-center shadow-sm">
                                        <div className="relative">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -top-1 left-1/2 -translate-x-1/2" />
                                            <TreePine className="w-12 h-12 text-green-600" />
                                        </div>
                                    </div>

                                    {/* Show Image Toggle at Bottom Exit */}
                                    <div className="absolute top-[230px] left-[270px] flex flex-col gap-2">
                                        <button
                                            onClick={() => setShowBottomImage(!showBottomImage)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${showBottomImage ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                        >
                                            像を表示
                                        </button>
                                    </div>

                                    {/* Image (Visible if toggled) */}
                                    {showBottomImage && (
                                        <div className="absolute top-[205px] left-[185px] w-[70px] h-[80px] flex flex-col items-center justify-center z-10 pointer-events-none">
                                            <div className="relative -rotate-90">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -top-1 left-1/2 -translate-x-1/2" />
                                                <TreePine className="w-12 h-12 text-green-600" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Right View (Problem 3) */}
                        <div className="flex-1 p-6 flex flex-col bg-white rounded-b-xl md:rounded-r-xl md:rounded-bl-none relative">
                            <button
                                onClick={resetRightPanel}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                title="リセット"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <p className="text-sm font-bold text-slate-600 text-center mb-4">正面から見た様子</p>
                            <div className="flex-1 flex items-center justify-center relative py-12">
                                <div className="relative w-[300px] h-[300px]">

                                    {/* Mirror Toggle (Left Side) */}
                                    <div className="absolute top-[50px] -left-[60px]">
                                        <button
                                            onClick={() => setShowRightMirrors(!showRightMirrors)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${showRightMirrors ? 'bg-slate-100 border-slate-400 text-slate-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                        >
                                            鏡を表示
                                        </button>
                                    </div>

                                    {/* Light Toggles (Right Side) */}
                                    <div className="absolute top-[25px] -right-[60px] flex flex-col gap-2">
                                        <button
                                            onClick={() => setShowRightStarLight(!showRightStarLight)}
                                            disabled={!showRightMirrors}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${showRightStarLight ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-white border-slate-200 text-slate-500'} ${!showRightMirrors ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            星の光
                                        </button>
                                        <button
                                            onClick={() => setShowRightTreeLight(!showRightTreeLight)}
                                            disabled={!showRightMirrors}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${showRightTreeLight ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-slate-200 text-slate-500'} ${!showRightMirrors ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            木の光
                                        </button>
                                    </div>

                                    {/* Cylinder (Inverted L-shape, Mirrored) */}
                                    <svg width="100%" height="100%" viewBox="0 0 300 300" className="absolute top-0 left-0 pointer-events-none">
                                        {/* Walls */}
                                        <path d="M 200,20 L 40,20 L 40,280 L 120,280 L 120,100 L 200,100" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                                        {/* Opening (Right) */}
                                        <line x1="200" y1="20" x2="200" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-300" />

                                        {/* Opening (Front-Bottom) */}
                                        <line x1="40" y1="200" x2="120" y2="200" stroke="currentColor" strokeWidth="1" className="text-slate-400" />

                                        {/* Mirror 2 (Bottom Left) - Trapezoid */}
                                        {showRightMirrors && (
                                            <polygon points="54,220 106,220 112,270 48,270" fill="#f1f5f9" stroke="#64748b" strokeWidth="4" />
                                        )}

                                        {/* Light Rays */}
                                        {showRightStarLight && calculateRayPath(40, '#facc15', true)}
                                        {showRightTreeLight && calculateRayPath(80, '#16a34a', true)}

                                        {/* Mirror 1 (Top Left Corner) - Slash */}
                                        {showRightMirrors && (
                                            <line x1="50" y1="90" x2="110" y2="30" stroke="#64748b" strokeWidth="4" />
                                        )}
                                    </svg>

                                    {/* Object (Tree Card) at Right Opening */}
                                    <div className="absolute top-[25px] right-[20px] w-[70px] h-[80px] border-2 border-slate-300 bg-white rounded-md flex flex-col items-center justify-center shadow-sm">
                                        <div className="relative">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute -top-1 left-1/2 -translate-x-1/2" />
                                            <TreePine className="w-12 h-12 text-green-600" />
                                        </div>
                                    </div>

                                    {/* Show Image Toggle at Bottom Exit (Left Side) */}
                                    <div className="absolute top-[230px] -left-[60px] flex flex-col gap-2">
                                        <button
                                            onClick={() => setShowRightImage(!showRightImage)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${showRightImage ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                        >
                                            像を表示
                                        </button>
                                    </div>

                                    {/* Image (Visible if toggled) */}
                                    {showRightImage && (
                                        <div className="absolute top-[205px] left-[45px] w-[70px] h-[80px] flex flex-col items-center justify-center z-10 pointer-events-none">
                                            <div className="relative rotate-90">
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
