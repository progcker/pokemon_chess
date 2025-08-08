// Pokemon Chess Battle Arena - WITH REAL POKEMON IMAGES - FIXED
class PokemonChessBattle {
    constructor() {
        // OPTIMIZED Pokemon sprite URLs with preloading
        this.pokemonSprites = {
            'white': {
                'king': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d3dbe2ba-225e-4f7f-a4da-59a91d1e7cc5.png', // Arceus
                'queen': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/c7d2108c-e0ec-4f42-835a-444d4eeede7c.png', // Mewtwo
                'rook': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/36d2c205-ebf2-40fe-ac37-3ad027c42b5d.png', // Steelix
                'bishop': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/c7d2108c-e0ec-4f42-835a-444d4eeede7c.png', // Placeholder: Mewtwo for now
                'knight': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d44d57d4-a6da-4f68-9f2c-3e24c70a00f6.png', // Rapidash
                'pawn': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/dc74b426-669a-41c0-9dd5-e5debffffa2f.png' // Pikachu
            },
            'black': {
                'king': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/bcea8d88-a099-48e3-8690-6c0f87ca2d4d.png', // Giratina
                'queen': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/c77c9bd8-6f9e-41b6-979b-7319f1ef34d1.png', // Darkrai
                'rook': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/36d2c205-ebf2-40fe-ac37-3ad027c42b5d.png', // Placeholder: Steelix for now
                'bishop': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/fbf545ae-7988-4543-b8ce-64e8d6592973.png', // Gengar
                'knight': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/d44d57d4-a6da-4f68-9f2c-3e24c70a00f6.png', // Placeholder: Rapidash for now
                'pawn': 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/443a841b-bb57-4508-bfd4-ae2aeebbc95a.png' // Eevee
            }
        };
        
        // Image cache for performance optimization
        this.imageCache = new Map();
        this.preloadedImages = new Set();

        // Pokemon data with names and types
        this.pokemonData = {
            'white': {
                'king': { name: 'Arceus', type: 'Normal', color: '#FFD700' },
                'queen': { name: 'Mewtwo', type: 'Psychic', color: '#FF6EC7' },
                'rook': { name: 'Steelix', type: 'Steel', color: '#B8B8D0' },
                'bishop': { name: 'Alakazam', type: 'Psychic', color: '#FF6EC7' },
                'knight': { name: 'Rapidash', type: 'Fire', color: '#FF4444' },
                'pawn': { name: 'Pikachu', type: 'Electric', color: '#FFD700' }
            },
            'black': {
                'king': { name: 'Giratina', type: 'Ghost', color: '#8B5CF6' },
                'queen': { name: 'Darkrai', type: 'Dark', color: '#4A4A4A' },
                'rook': { name: 'Aggron', type: 'Steel', color: '#B8B8D0' },
                'bishop': { name: 'Gengar', type: 'Ghost', color: '#8B5CF6' },
                'knight': { name: 'Mudsdale', type: 'Ground', color: '#D4A574' },
                'pawn': { name: 'Eevee', type: 'Normal', color: '#8B7355' }
            }
        };

        // Pokemon terminology
        this.pokemonTerms = {
            'check': 'Pokemon in Danger!',
            'checkmate': 'Pokemon Fainted!',
            'capture': 'Pokemon defeated!',
            'move': 'Pokemon used move!',
            'turn': 'Trainer\'s turn',
            'game_over': 'Battle ended!'
        };

        // Game state initialization
        this.board = this.createInitialBoard();
        this.currentTrainer = 'white';
        this.selectedSquare = null;
        this.gameHistory = [];
        this.capturedPokemon = { white: [], black: [] };
        this.battleStatus = 'active';
        this.moveHistory = [];
        this.kingPositions = { white: { row: 7, col: 4 }, black: { row: 0, col: 4 } };
        this.moveCount = 1;

        // DOM element references
        this.battlefield = document.getElementById('chess-battlefield');
        this.currentTrainerElement = document.getElementById('current-trainer');
        this.teamIndicator = document.getElementById('team-indicator');
        this.gameStatusElement = document.getElementById('game-status');
        this.checkWarning = document.getElementById('check-warning');
        this.battleHistory = document.getElementById('battle-history');
        this.capturedWhite = document.getElementById('captured-white');
        this.capturedBlack = document.getElementById('captured-black');
        this.capturedCountWhite = document.getElementById('captured-count-white');
        this.capturedCountBlack = document.getElementById('captured-count-black');

        // Initialize the complete game
        this.preloadCriticalImages();
        this.initializeBattle();
        this.setupEventHandlers();
        this.loadSavedGame();
        this.playBattleSound('start');
        this.setupResponsiveHandlers();
    }

    createInitialBoard() {
        // Create empty 8x8 board
        const board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Standard chess starting positions
        const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        
        // Place black pieces (top rows 0-1)
        for (let col = 0; col < 8; col++) {
            board[0][col] = { type: pieceOrder[col], color: 'black' };
            board[1][col] = { type: 'pawn', color: 'black' };
        }
        
        // Place white pieces (bottom rows 6-7)
        for (let col = 0; col < 8; col++) {
            board[6][col] = { type: 'pawn', color: 'white' };
            board[7][col] = { type: pieceOrder[col], color: 'white' };
        }
        
        return board;
    }

    initializeBattle() {
        this.renderCompleteBattlefield();
        this.updateBattleStatus();
        this.updateBattleLog();
        this.updateCapturedPokemon();
        this.updateTrainerDisplay();
    }

    renderCompleteBattlefield() {
        // Clear existing battlefield
        this.battlefield.innerHTML = '';
        
        // Create all 64 squares (8x8 complete board)
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = this.createBattleSquare(row, col);
                this.battlefield.appendChild(square);
            }
        }

        // Restore selection state if piece is selected
        if (this.selectedSquare) {
            this.highlightSelectedSquare();
            this.showValidMoves();
        }
    }

    createBattleSquare(row, col) {
        const square = document.createElement('div');
        square.className = `battle-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
        square.dataset.row = row;
        square.dataset.col = col;
        
        const pokemon = this.board[row][col];
        if (pokemon) {
            const pokemonElement = this.createPokemonPiece(pokemon);
            square.appendChild(pokemonElement);
        }
        
        return square;
    }

    // OPTIMIZED: Preload critical images for better performance
    async preloadCriticalImages() {
        const criticalPieces = ['king', 'queen', 'pawn']; // Most commonly seen pieces
        const preloadPromises = [];
        
        for (const color of ['white', 'black']) {
            for (const piece of criticalPieces) {
                const url = this.pokemonSprites[color][piece];
                if (!this.preloadedImages.has(url)) {
                    preloadPromises.push(this.preloadImage(url));
                }
            }
        }
        
        try {
            await Promise.allSettled(preloadPromises);
            console.log('Critical Pokemon images preloaded');
        } catch (error) {
            console.warn('Some images failed to preload:', error);
        }
    }
    
    // OPTIMIZED: Smart image preloading with caching
    preloadImage(url) {
        return new Promise((resolve, reject) => {
            if (this.imageCache.has(url)) {
                resolve(this.imageCache.get(url));
                return;
            }
            
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(url, img);
                this.preloadedImages.add(url);
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    createPokemonPiece(pokemon) {
        // Get Pokemon data and sprite URL
        const pokemonData = this.pokemonData[pokemon.color][pokemon.type];
        const spriteUrl = this.pokemonSprites[pokemon.color][pokemon.type];
        
        const pieceElement = document.createElement('div');
        pieceElement.className = 'pokemon-piece';
        pieceElement.dataset.color = pokemon.color;
        pieceElement.dataset.type = pokemonData.type;
        pieceElement.dataset.piece = pokemon.type;
        pieceElement.title = `${pokemonData.name} (${pokemonData.type}-type)`;
        
        // OPTIMIZED: Use cached image if available, otherwise create new one
        let imageElement;
        if (this.imageCache.has(spriteUrl)) {
            imageElement = this.imageCache.get(spriteUrl).cloneNode();
            imageElement.className = 'pokemon-image';
        } else {
            imageElement = document.createElement('img');
            imageElement.className = 'pokemon-image';
            imageElement.src = spriteUrl;
            // Lazy load non-critical images
            if (!this.preloadedImages.has(spriteUrl)) {
                imageElement.loading = 'lazy';
            }
        }
        
        imageElement.alt = pokemonData.name;
        imageElement.draggable = false;
        
        // RESPONSIVE: Remove fixed sizing, let CSS handle it
        imageElement.style.cssText = `
            object-fit: contain;
            border-radius: 6px;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
            transition: all 0.25s ease;
            pointer-events: none;
            width: 100%;
            height: 100%;
            max-width: 90%;
            max-height: 90%;
        `;
        
        // OPTIMIZED: Enhanced error handling with better fallback
        imageElement.onerror = () => {
            console.warn(`Failed to load image for ${pokemonData.name}:`, spriteUrl);
            this.createFallbackElement(pieceElement, imageElement, pokemonData);
        };
        
        imageElement.onload = () => {
            if (!this.imageCache.has(spriteUrl)) {
                this.imageCache.set(spriteUrl, imageElement.cloneNode());
            }
        };
        
        pieceElement.appendChild(imageElement);
        
        // Preload this image for future use if not already cached
        if (!this.preloadedImages.has(spriteUrl)) {
            this.preloadImage(spriteUrl).catch(() => {});
        }
        
        return pieceElement;
    }
    
    // OPTIMIZED: Better fallback element creation
    createFallbackElement(pieceElement, imageElement, pokemonData) {
        const fallbackElement = document.createElement('div');
        fallbackElement.className = 'pokemon-image pokemon-fallback';
        fallbackElement.style.cssText = `
            width: 100%;
            height: 100%;
            max-width: 90%;
            max-height: 90%;
            background: linear-gradient(135deg, ${pokemonData.color}, ${pokemonData.color}aa);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: white;
            font-size: clamp(6px, 1.5vw, 8px);
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            text-align: center;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
            border: 2px solid ${pokemonData.color};
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
        `;
        fallbackElement.innerHTML = `
            <div style="font-size: clamp(8px, 2vw, 10px); line-height: 1;">${pokemonData.name}</div>
            <div style="font-size: clamp(5px, 1.2vw, 6px); opacity: 0.8; margin-top: 1px;">${pokemonData.type}</div>
        `;
        
        pieceElement.removeChild(imageElement);
        pieceElement.appendChild(fallbackElement);
    }

    setupEventHandlers() {
        // Battlefield click handling
        this.battlefield.addEventListener('click', (e) => this.handleSquareClick(e));
        
        // Control button handlers
        document.getElementById('new-battle').addEventListener('click', () => this.startNewBattle());
        document.getElementById('undo-move').addEventListener('click', () => this.undoLastMove());
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Modal handlers
        const newBattleVictory = document.getElementById('new-battle-victory');
        const closeVictory = document.getElementById('close-victory');
        
        if (newBattleVictory) {
            newBattleVictory.addEventListener('click', () => {
                this.hideModal('victory-modal');
                this.startNewBattle();
            });
        }
        
        if (closeVictory) {
            closeVictory.addEventListener('click', () => this.hideModal('victory-modal'));
        }
        
        // Evolution modal handlers
        document.querySelectorAll('.evolution-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pieceType = e.currentTarget.dataset.piece;
                this.completeEvolution(pieceType);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Auto-save on page unload
        window.addEventListener('beforeunload', () => this.saveGame());
    }
    
    // RESPONSIVE: Setup responsive event handlers
    setupResponsiveHandlers() {
        // Handle orientation changes on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });
        
        // Handle window resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // Handle touch events for mobile
        if ('ontouchstart' in window) {
            this.setupTouchHandlers();
        }
    }
    
    // RESPONSIVE: Handle resize events
    handleResize() {
        // Force re-render of battlefield to adjust to new dimensions
        this.renderCompleteBattlefield();
        
        // Update any fixed positioning elements
        this.updateResponsiveElements();
    }
    
    // RESPONSIVE: Setup touch handlers for mobile
    setupTouchHandlers() {
        let touchStartTime = 0;
        
        this.battlefield.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            e.preventDefault(); // Prevent double-tap zoom
        }, { passive: false });
        
        this.battlefield.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 300) { // Quick tap
                const touch = e.changedTouches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                const square = element?.closest('.battle-square');
                if (square) {
                    this.handleSquareClick({ target: square });
                }
            }
            e.preventDefault();
        }, { passive: false });
    }
    
    // RESPONSIVE: Update responsive elements
    updateResponsiveElements() {
        // Update any elements that need responsive adjustments
        const battlefield = document.querySelector('.battlefield');
        if (battlefield) {
            const size = Math.min(window.innerWidth * 0.9, 520);
            battlefield.style.setProperty('--dynamic-size', `${size}px`);
        }
    }

    handleSquareClick(e) {
        const square = e.target.closest('.battle-square');
        if (!square) return;
        
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        
        if (this.selectedSquare) {
            if (this.selectedSquare.row === row && this.selectedSquare.col === col) {
                // Deselect current square
                this.clearSelection();
                this.playBattleSound('cancel');
            } else {
                // Attempt to make a move
                this.attemptMove(this.selectedSquare, { row, col });
            }
        } else {
            // Select a pokemon piece
            const pokemon = this.board[row][col];
            if (pokemon && pokemon.color === this.currentTrainer) {
                this.selectSquare(row, col);
                this.playBattleSound('select');
                this.showPokemonStats(pokemon);
            }
        }
    }

    selectSquare(row, col) {
        this.clearSelection();
        this.selectedSquare = { row, col };
        this.highlightSelectedSquare();
        this.showValidMoves();
    }

    highlightSelectedSquare() {
        if (!this.selectedSquare) return;
        
        const square = this.getSquareElement(this.selectedSquare.row, this.selectedSquare.col);
        if (square) {
            square.classList.add('selected');
            
            // Add extra visual emphasis
            const pokemonPiece = square.querySelector('.pokemon-piece');
            if (pokemonPiece) {
                pokemonPiece.style.transform = 'scale(1.1)';
                pokemonPiece.style.filter = 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))';
            }
        }
    }

    showValidMoves() {
        if (!this.selectedSquare) return;
        
        const validMoves = this.calculateValidMoves(this.selectedSquare.row, this.selectedSquare.col);
        validMoves.forEach(move => {
            const square = this.getSquareElement(move.row, move.col);
            if (square) {
                square.classList.add('valid-move');
                
                // Add pulsing dot for valid moves
                const dot = document.createElement('div');
                dot.className = 'valid-move-indicator';
                dot.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 20px;
                    height: 20px;
                    background: #4CAF50;
                    border-radius: 50%;
                    opacity: 0.8;
                    animation: pulse 1.5s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 10;
                    box-shadow: 0 0 10px rgba(76, 175, 80, 0.6);
                `;
                square.appendChild(dot);
            }
        });
    }

    showPokemonStats(pokemon) {
        const pokemonData = this.pokemonData[pokemon.color][pokemon.type];
        
        // Create a temporary status display
        const statusDisplay = document.createElement('div');
        statusDisplay.className = 'pokemon-status-display';
        statusDisplay.innerHTML = `
            <div style="
                position: fixed;
                top: 10%;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 50, 0.95));
                color: ${pokemonData.color};
                padding: 16px 24px;
                border-radius: 12px;
                font-family: var(--pokemon-font);
                font-weight: 700;
                z-index: 1000;
                animation: fade-in-out 3s ease-in-out forwards;
                border: 2px solid ${pokemonData.color};
                box-shadow: 0 0 25px ${pokemonData.color}60;
                text-align: center;
                backdrop-filter: blur(10px);
            ">
                <div style="font-size: 18px; margin-bottom: 6px; text-shadow: 0 0 10px ${pokemonData.color}80;">
                    ${pokemonData.name}
                </div>
                <div style="font-size: 12px; opacity: 0.9; color: white;">
                    ${pokemonData.type}-type Pokemon Selected
                </div>
            </div>
        `;
        
        document.body.appendChild(statusDisplay);
        setTimeout(() => statusDisplay.remove(), 3000);
    }

    clearSelection() {
        this.selectedSquare = null;
        
        // Remove all highlighting classes and effects
        document.querySelectorAll('.battle-square').forEach(square => {
            square.classList.remove('selected', 'valid-move', 'in-danger');
            
            // Remove valid move indicators
            const indicator = square.querySelector('.valid-move-indicator');
            if (indicator) {
                indicator.remove();
            }
            
            // Reset pokemon piece styling
            const pokemonPiece = square.querySelector('.pokemon-piece');
            if (pokemonPiece) {
                pokemonPiece.style.transform = '';
                pokemonPiece.style.filter = '';
            }
        });
    }

    attemptMove(from, to) {
        if (this.isValidMove(from, to)) {
            this.executePokemonMove(from, to);
        } else {
            this.clearSelection();
            this.playBattleSound('invalid');
        }
    }

    executePokemonMove(from, to) {
        const movingPokemon = this.board[from.row][from.col];
        const capturedPokemon = this.board[to.row][to.col];
        
        // Create move record with Pokemon names
        const moveRecord = this.createPokemonMoveRecord(from, to, movingPokemon, capturedPokemon);
        
        // Handle pokemon capture with battle effects
        if (capturedPokemon) {
            this.capturePokemon(capturedPokemon, movingPokemon);
            this.playBattleSound('capture');
            this.showBattleEffect('capture', movingPokemon, capturedPokemon);
        } else {
            this.playBattleSound('move');
            this.showBattleEffect('move', movingPokemon);
        }

        // Animate the move with Pokemon-appropriate effects
        this.animatePokemonMove(from, to, movingPokemon, () => {
            // Execute the actual move
            this.board[to.row][to.col] = movingPokemon;
            this.board[from.row][from.col] = null;

            // Update king position tracking
            if (movingPokemon.type === 'king') {
                this.kingPositions[movingPokemon.color] = { row: to.row, col: to.col };
            }

            // Handle pawn evolution at the end of board
            if (movingPokemon.type === 'pawn' && (to.row === 0 || to.row === 7)) {
                this.initiatePokemonEvolution(to, moveRecord);
                return;
            }

            // Complete the move
            this.completeBattleMove(moveRecord);
        });
    }

    animatePokemonMove(from, to, pokemon, callback) {
        const fromSquare = this.getSquareElement(from.row, from.col);
        const toSquare = this.getSquareElement(to.row, to.col);
        
        if (!fromSquare || !toSquare) {
            callback();
            return;
        }
        
        const pokemonElement = fromSquare.querySelector('.pokemon-piece');
        
        if (!pokemonElement) {
            callback();
            return;
        }

        // Get Pokemon data for animation type
        const pokemonData = this.pokemonData[pokemon.color][pokemon.type];
        
        // Calculate animation path
        const fromRect = fromSquare.getBoundingClientRect();
        const toRect = toSquare.getBoundingClientRect();
        
        const deltaX = toRect.left - fromRect.left;
        const deltaY = toRect.top - fromRect.top;

        // Add Pokemon-specific animation class
        pokemonElement.classList.add('moving');
        pokemonElement.style.cssText = `
            transform: translate(${deltaX}px, ${deltaY}px) scale(1.3);
            z-index: 100;
            filter: drop-shadow(0 6px 20px ${pokemonData.color}80) brightness(1.2);
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;

        // Show move description
        this.showMoveDescription(pokemonData);

        // Complete animation after delay
        setTimeout(() => {
            pokemonElement.style.cssText = '';
            pokemonElement.classList.remove('moving');
            callback();
        }, 600);
    }

    showMoveDescription(pokemonData) {
        const descriptions = ['charged forward!', 'used a powerful move!', 'attacked swiftly!', 'unleashed its power!'];
        const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        // Create move description popup
        const movePopup = document.createElement('div');
        movePopup.innerHTML = `⚡ ${pokemonData.name} ${randomDesc} ⚡`;
        movePopup.style.cssText = `
            position: fixed;
            top: 15%;
            right: 20px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 50, 0.95));
            color: ${pokemonData.color};
            padding: 12px 20px;
            border-radius: 8px;
            font-family: var(--pokemon-font);
            font-size: 14px;
            font-weight: 700;
            z-index: 999;
            animation: slide-in-out 2.5s ease-out forwards;
            border: 2px solid ${pokemonData.color};
            box-shadow: 0 0 20px ${pokemonData.color}40;
            text-shadow: 0 0 10px ${pokemonData.color}60;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(movePopup);
        setTimeout(() => movePopup.remove(), 2500);
    }

    showBattleEffect(type, attackingPokemon, defendingPokemon = null) {
        if (type === 'capture' && defendingPokemon) {
            const messages = ['Super effective!', 'It\'s not very effective...', 'Critical hit!', 'Pokemon fainted!'];
            const message = messages[Math.floor(Math.random() * messages.length)];
            
            const attackerData = this.pokemonData[attackingPokemon.color][attackingPokemon.type];
            const defenderData = this.pokemonData[defendingPokemon.color][defendingPokemon.type];
            
            // Create battle effect display
            const effectElement = document.createElement('div');
            effectElement.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 12px; animation: bounce 0.5s ease-in-out;">💥⚡💥</div>
                <div style="font-size: 20px; font-weight: 900; margin-bottom: 8px; text-shadow: 0 0 15px rgba(255,255,255,0.8);">
                    ${message}
                </div>
                <div style="font-size: 16px; opacity: 0.9;">
                    ${attackerData.name} defeated ${defenderData.name}!
                </div>
            `;
            effectElement.style.cssText = `
                position: fixed;
                top: 35%;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #FF1744, #FF6B35, #FFD700);
                color: white;
                padding: 24px 32px;
                border-radius: 16px;
                font-family: var(--pokemon-font);
                font-weight: bold;
                z-index: 1000;
                animation: battle-popup 3.5s ease-out forwards;
                text-align: center;
                border: 4px solid #FFD700;
                box-shadow: 0 0 40px rgba(255, 23, 68, 0.9), inset 0 1px 0 rgba(255,255,255,0.3);
                backdrop-filter: blur(10px);
            `;
            document.body.appendChild(effectElement);
            
            setTimeout(() => effectElement.remove(), 3500);
        }
    }

    // Continue with rest of methods (keeping the same logic but with better visual feedback)...

    createPokemonMoveRecord(from, to, pokemon, captured) {
        const files = 'abcdefgh';
        const movingPokemonData = this.pokemonData[pokemon.color][pokemon.type];
        
        let notation = `${movingPokemonData.name}`;
        
        if (captured) {
            const capturedPokemonData = this.pokemonData[captured.color][captured.type];
            notation += ` defeated ${capturedPokemonData.name}`;
        } else {
            notation += ` to ${files[to.col]}${8 - to.row}`;
        }
        
        return {
            from: { ...from },
            to: { ...to },
            pokemon: { ...pokemon },
            captured: captured ? { ...captured } : null,
            notation,
            pokemonNotation: notation,
            boardState: this.board.map(row => row.map(cell => cell ? { ...cell } : null)),
            timestamp: Date.now()
        };
    }

    capturePokemon(capturedPokemon, attackingPokemon) {
        this.capturedPokemon[capturedPokemon.color].push(capturedPokemon);
        
        const capturedData = this.pokemonData[capturedPokemon.color][capturedPokemon.type];
        const attackingData = this.pokemonData[attackingPokemon.color][attackingPokemon.type];
        
        const captureEffect = document.createElement('div');
        captureEffect.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 16px; animation: spin 1s ease-in-out;">💥⚡💥</div>
            <div style="font-size: 22px; font-weight: 900; margin-bottom: 12px; text-shadow: 0 0 15px rgba(255,255,255,0.8);">
                ${attackingData.name} defeated ${capturedData.name}!
            </div>
            <div style="font-size: 16px; opacity: 0.9; font-style: italic;">
                ${capturedData.name} fainted and was captured!
            </div>
        `;
        captureEffect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213E 100%);
            color: white;
            padding: 32px 40px;
            border-radius: 20px;
            text-align: center;
            z-index: 1000;
            animation: capture-burst 2.5s ease-out forwards;
            pointer-events: none;
            font-family: var(--pokemon-font);
            border: 4px solid #FFD700;
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.9);
        `;
        document.body.appendChild(captureEffect);
        
        setTimeout(() => captureEffect.remove(), 2500);
    }

    completeBattleMove(moveRecord) {
        this.gameHistory.push(moveRecord);
        this.addPokemonMoveToHistory(moveRecord.pokemonNotation);
        this.currentTrainer = this.currentTrainer === 'white' ? 'black' : 'white';
        this.clearSelection();
        this.renderCompleteBattlefield();
        this.updateBattleStatus();
        this.updateCapturedPokemon();
        this.updateTrainerDisplay();
        this.checkBattleEnd();
        this.saveGame();
    }

    addPokemonMoveToHistory(notation) {
        if (this.currentTrainer === 'white') {
            this.moveHistory.push({
                number: this.moveCount,
                white: notation,
                black: ''
            });
        } else {
            const lastMove = this.moveHistory[this.moveHistory.length - 1];
            if (lastMove && lastMove.number === this.moveCount) {
                lastMove.black = notation;
            } else {
                this.moveHistory.push({
                    number: this.moveCount,
                    white: '',
                    black: notation
                });
            }
            this.moveCount++;
        }
        
        this.updateBattleLog();
    }

    initiatePokemonEvolution(position, moveRecord) {
        this.evolutionData = { position, moveRecord };
        
        const modalTitle = document.querySelector('.evolution-header h2');
        const modalMessage = document.querySelector('.evolution-message');
        
        if (modalTitle) modalTitle.textContent = '✨ POKÉMON EVOLUTION! ✨';
        if (modalMessage) modalMessage.textContent = 'Your Pokémon has reached the end of the battlefield! Choose its evolution:';
        
        const evolutionChoices = document.querySelectorAll('.evolution-option');
        const evolutions = [
            { piece: 'queen', title: 'LEGENDARY', pokemon: this.currentTrainer === 'white' ? 'Mewtwo' : 'Darkrai' },
            { piece: 'rook', title: 'FORTRESS', pokemon: this.currentTrainer === 'white' ? 'Steelix' : 'Aggron' },
            { piece: 'bishop', title: 'PSYCHIC', pokemon: this.currentTrainer === 'white' ? 'Alakazam' : 'Gengar' },
            { piece: 'knight', title: 'SWIFT', pokemon: this.currentTrainer === 'white' ? 'Rapidash' : 'Mudsdale' }
        ];
        
        evolutionChoices.forEach((choice, index) => {
            if (evolutions[index]) {
                const pokemonName = choice.querySelector('.choice-pokemon');
                if (pokemonName) pokemonName.textContent = evolutions[index].pokemon;
            }
        });
        
        this.showModal('evolution-modal');
        this.playBattleSound('evolution');
    }

    completeEvolution(newType) {
        const { position, moveRecord } = this.evolutionData;
        
        this.board[position.row][position.col].type = newType;
        moveRecord.evolution = newType;
        
        const newPokemonData = this.pokemonData[this.board[position.row][position.col].color][newType];
        moveRecord.pokemonNotation += ` → evolved into ${newPokemonData.name}!`;
        
        this.hideModal('evolution-modal');
        this.completeBattleMove(moveRecord);
    }

    // Chess movement logic (keeping existing methods)
    isValidMove(from, to) {
        const validMoves = this.calculateValidMoves(from.row, from.col);
        return validMoves.some(move => move.row === to.row && move.col === to.col);
    }

    calculateValidMoves(row, col) {
        const pokemon = this.board[row][col];
        if (!pokemon || pokemon.color !== this.currentTrainer) return [];
        
        let moves = [];
        
        switch (pokemon.type) {
            case 'pawn':
                moves = this.getPawnMoves(row, col, pokemon.color);
                break;
            case 'rook':
                moves = this.getRookMoves(row, col, pokemon.color);
                break;
            case 'bishop':
                moves = this.getBishopMoves(row, col, pokemon.color);
                break;
            case 'knight':
                moves = this.getKnightMoves(row, col, pokemon.color);
                break;
            case 'queen':
                moves = [...this.getRookMoves(row, col, pokemon.color), ...this.getBishopMoves(row, col, pokemon.color)];
                break;
            case 'king':
                moves = this.getKingMoves(row, col, pokemon.color);
                break;
        }
        
        return moves.filter(move => !this.wouldLeaveKingInCheck(pokemon.color, { row, col }, move));
    }

    getPawnMoves(row, col, color) {
        const moves = [];
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;
        
        const newRow = row + direction;
        if (this.isValidPosition(newRow, col) && !this.board[newRow][col]) {
            moves.push({ row: newRow, col });
            
            if (row === startRow && !this.board[row + 2 * direction][col]) {
                moves.push({ row: row + 2 * direction, col });
            }
        }
        
        [-1, 1].forEach(deltaCol => {
            const captureRow = row + direction;
            const captureCol = col + deltaCol;
            
            if (this.isValidPosition(captureRow, captureCol)) {
                const target = this.board[captureRow][captureCol];
                if (target && target.color !== color) {
                    moves.push({ row: captureRow, col: captureCol });
                }
            }
        });
        
        return moves;
    }

    getRookMoves(row, col, color) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        
        directions.forEach(([deltaRow, deltaCol]) => {
            for (let i = 1; i < 8; i++) {
                const newRow = row + deltaRow * i;
                const newCol = col + deltaCol * i;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                
                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (target.color !== color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        });
        
        return moves;
    }

    getBishopMoves(row, col, color) {
        const moves = [];
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        
        directions.forEach(([deltaRow, deltaCol]) => {
            for (let i = 1; i < 8; i++) {
                const newRow = row + deltaRow * i;
                const newCol = col + deltaCol * i;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                
                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (target.color !== color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        });
        
        return moves;
    }

    getKnightMoves(row, col, color) {
        const moves = [];
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        
        knightMoves.forEach(([deltaRow, deltaCol]) => {
            const newRow = row + deltaRow;
            const newCol = col + deltaCol;
            
            if (this.isValidPosition(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });
        
        return moves;
    }

    getKingMoves(row, col, color) {
        const moves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        
        directions.forEach(([deltaRow, deltaCol]) => {
            const newRow = row + deltaRow;
            const newCol = col + deltaCol;
            
            if (this.isValidPosition(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });
        
        return moves;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    wouldLeaveKingInCheck(color, from, to) {
        const originalFrom = this.board[from.row][from.col];
        const originalTo = this.board[to.row][to.col];
        
        this.board[to.row][to.col] = originalFrom;
        this.board[from.row][from.col] = null;
        
        let tempKingPos = { ...this.kingPositions[color] };
        if (originalFrom.type === 'king') {
            tempKingPos = { row: to.row, col: to.col };
        }
        
        const inCheck = this.isKingInCheck(color, tempKingPos);
        
        this.board[from.row][from.col] = originalFrom;
        this.board[to.row][to.col] = originalTo;
        
        return inCheck;
    }

    isKingInCheck(color, kingPos = null) {
        const kingPosition = kingPos || this.kingPositions[color];
        const opponentColor = color === 'white' ? 'black' : 'white';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const pokemon = this.board[row][col];
                if (pokemon && pokemon.color === opponentColor) {
                    const attackMoves = this.getPossibleMoves(row, col, pokemon);
                    if (attackMoves.some(move => move.row === kingPosition.row && move.col === kingPosition.col)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    getPossibleMoves(row, col, pokemon) {
        switch (pokemon.type) {
            case 'pawn': return this.getPawnMoves(row, col, pokemon.color);
            case 'rook': return this.getRookMoves(row, col, pokemon.color);
            case 'bishop': return this.getBishopMoves(row, col, pokemon.color);
            case 'knight': return this.getKnightMoves(row, col, pokemon.color);
            case 'queen': return [...this.getRookMoves(row, col, pokemon.color), ...this.getBishopMoves(row, col, pokemon.color)];
            case 'king': return this.getKingMoves(row, col, pokemon.color);
            default: return [];
        }
    }

    checkBattleEnd() {
        const inCheck = this.isKingInCheck(this.currentTrainer);
        const hasValidMoves = this.hasAnyValidMoves(this.currentTrainer);
        
        if (!hasValidMoves) {
            if (inCheck) {
                this.battleStatus = 'checkmate';
                const winner = this.currentTrainer === 'white' ? 'Black' : 'White';
                this.showVictoryModal(`🏆 ${this.pokemonTerms.checkmate} 🏆`, `${winner} trainer wins the battle!`);
                this.playBattleSound('victory');
            } else {
                this.battleStatus = 'stalemate';
                this.showVictoryModal(`⚖️ STALEMATE ⚖️`, `The battle ends in a draw!`);
                this.playBattleSound('draw');
            }
        } else if (inCheck) {
            this.battleStatus = 'check';
            this.playBattleSound('check');
        } else {
            this.battleStatus = 'active';
        }
    }

    hasAnyValidMoves(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const pokemon = this.board[row][col];
                if (pokemon && pokemon.color === color) {
                    const validMoves = this.calculateValidMoves(row, col);
                    if (validMoves.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    updateBattleStatus() {
        if (this.currentTrainerElement) {
            const trainerText = `${this.currentTrainer.charAt(0).toUpperCase() + this.currentTrainer.slice(1)} Trainer`;
            this.currentTrainerElement.textContent = trainerText;
        }
        
        let statusText = '';
        let showWarning = false;
        
        switch (this.battleStatus) {
            case 'check':
                statusText = this.pokemonTerms.check;
                showWarning = true;
                break;
            case 'checkmate':
                statusText = `${this.pokemonTerms.game_over} - ${this.pokemonTerms.checkmate}`;
                break;
            case 'stalemate':
                statusText = `${this.pokemonTerms.game_over} - Stalemate!`;
                break;
            default:
                statusText = 'Battle in Progress';
                break;
        }
        
        if (this.gameStatusElement) {
            this.gameStatusElement.textContent = statusText;
        }
        
        if (this.checkWarning) {
            if (showWarning) {
                this.checkWarning.classList.remove('hidden');
                const warningText = this.checkWarning.querySelector('.warning-text');
                if (warningText) warningText.textContent = this.pokemonTerms.check;
            } else {
                this.checkWarning.classList.add('hidden');
            }
        }
        
        const undoButton = document.getElementById('undo-move');
        if (undoButton) {
            undoButton.disabled = this.gameHistory.length === 0;
        }
    }

    updateTrainerDisplay() {
        const teamBadge = document.querySelector('.team-badge');
        const trainerPortrait = document.querySelector('.trainer-portrait');
        
        if (teamBadge && trainerPortrait) {
            if (this.currentTrainer === 'white') {
                teamBadge.textContent = 'TEAM MYSTIC';
                trainerPortrait.style.background = 'linear-gradient(45deg, #1B4CFF, #4D79A4)';
            } else {
                teamBadge.textContent = 'TEAM VALOR';
                trainerPortrait.style.background = 'linear-gradient(45deg, #FF1744, #FF6B35)';
            }
        }
    }

    updateBattleLog() {
        if (!this.battleHistory) return;
        
        if (this.moveHistory.length === 0) {
            this.battleHistory.innerHTML = '<div class="no-battles">No battles recorded yet</div>';
            return;
        }
        
        let historyHTML = '';
        this.moveHistory.forEach(move => {
            historyHTML += `
                <div class="battle-entry">
                    <span class="entry-number">${move.number}.</span>
                    <span class="entry-white">${move.white || '---'}</span>
                    <span class="entry-black">${move.black || '---'}</span>
                </div>
            `;
        });
        
        this.battleHistory.innerHTML = historyHTML;
        this.battleHistory.scrollTop = this.battleHistory.scrollHeight;
    }

    updateCapturedPokemon() {
        if (this.capturedWhite) {
            if (this.capturedPokemon.white.length === 0) {
                this.capturedWhite.innerHTML = `
                    <div class="empty-box">
                        <div class="empty-icon">📦</div>
                        <div class="empty-text">No Captured Pokémon</div>
                    </div>
                `;
            } else {
                this.capturedWhite.innerHTML = this.capturedPokemon.white
                    .map(pokemon => {
                        const data = this.pokemonData[pokemon.color][pokemon.type];
                        const spriteUrl = this.pokemonSprites[pokemon.color][pokemon.type];
                        return `
                            <div class="captured-pokemon" title="${data.name} (${data.type}-type)">
                                <div class="captured-display">
                                    <img src="${spriteUrl}" alt="${data.name}" style="width: 40px; height: 40px; object-fit: contain;" />
                                </div>
                                <div class="captured-name">${data.name}</div>
                            </div>
                        `;
                    }).join('');
            }
        }
        
        if (this.capturedBlack) {
            if (this.capturedPokemon.black.length === 0) {
                this.capturedBlack.innerHTML = `
                    <div class="empty-box">
                        <div class="empty-icon">📦</div>
                        <div class="empty-text">No Captured Pokémon</div>
                    </div>
                `;
            } else {
                this.capturedBlack.innerHTML = this.capturedPokemon.black
                    .map(pokemon => {
                        const data = this.pokemonData[pokemon.color][pokemon.type];
                        const spriteUrl = this.pokemonSprites[pokemon.color][pokemon.type];
                        return `
                            <div class="captured-pokemon" title="${data.name} (${data.type}-type)">
                                <div class="captured-display">
                                    <img src="${spriteUrl}" alt="${data.name}" style="width: 40px; height: 40px; object-fit: contain;" />
                                </div>
                                <div class="captured-name">${data.name}</div>
                            </div>
                        `;
                    }).join('');
            }
        }
        
        if (this.capturedCountWhite) {
            this.capturedCountWhite.textContent = this.capturedPokemon.white.length;
        }
        if (this.capturedCountBlack) {
            this.capturedCountBlack.textContent = this.capturedPokemon.black.length;
        }
    }

    // Utility methods
    undoLastMove() {
        if (this.gameHistory.length === 0) return;
        
        const lastMove = this.gameHistory.pop();
        
        this.board = lastMove.boardState.map(row => row.map(cell => cell ? { ...cell } : null));
        this.findKingPositions();
        
        if (lastMove.captured) {
            const capturedArray = this.capturedPokemon[lastMove.captured.color];
            if (capturedArray.length > 0) {
                capturedArray.pop();
            }
        }
        
        if (this.currentTrainer === 'black') {
            const lastHistoryMove = this.moveHistory[this.moveHistory.length - 1];
            if (lastHistoryMove) {
                lastHistoryMove.black = '';
            }
        } else {
            this.moveHistory.pop();
            this.moveCount--;
        }
        
        this.currentTrainer = this.currentTrainer === 'white' ? 'black' : 'white';
        this.battleStatus = 'active';
        
        this.clearSelection();
        this.renderCompleteBattlefield();
        this.updateBattleStatus();
        this.updateBattleLog();
        this.updateCapturedPokemon();
        this.updateTrainerDisplay();
        
        this.playBattleSound('undo');
        this.saveGame();
    }

    findKingPositions() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const pokemon = this.board[row][col];
                if (pokemon && pokemon.type === 'king') {
                    this.kingPositions[pokemon.color] = { row, col };
                }
            }
        }
    }

    startNewBattle() {
        this.board = this.createInitialBoard();
        this.currentTrainer = 'white';
        this.selectedSquare = null;
        this.gameHistory = [];
        this.moveHistory = [];
        this.capturedPokemon = { white: [], black: [] };
        this.battleStatus = 'active';
        this.kingPositions = { white: { row: 7, col: 4 }, black: { row: 0, col: 4 } };
        this.moveCount = 1;
        
        this.clearSelection();
        this.initializeBattle();
        
        this.playBattleSound('start');
        this.saveGame();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('pokemon-chess-theme', newTheme);
        
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            const btnText = themeBtn.querySelector('.btn-text');
            const btnIcon = themeBtn.querySelector('.btn-icon');
            
            if (btnText && btnIcon) {
                if (newTheme === 'dark') {
                    btnText.textContent = 'LIGHT MODE';
                    btnIcon.textContent = '☀️';
                } else {
                    btnText.textContent = 'DARK MODE';
                    btnIcon.textContent = '🌙';
                }
            }
        }
    }

    handleKeyPress(e) {
        switch (e.key) {
            case ' ':
                e.preventDefault();
                this.startNewBattle();
                break;
            case 'z':
            case 'Z':
                e.preventDefault();
                this.undoLastMove();
                break;
            case 'Escape':
                e.preventDefault();
                this.clearSelection();
                break;
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showVictoryModal(title, message) {
        const titleElement = document.getElementById('victory-title');
        const messageElement = document.getElementById('victory-message');
        
        if (titleElement) titleElement.textContent = title;
        if (messageElement) messageElement.textContent = message;
        
        this.showModal('victory-modal');
    }

    getSquareElement(row, col) {
        const index = row * 8 + col;
        return this.battlefield ? this.battlefield.children[index] : null;
    }

    playBattleSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            let frequency, duration, waveType = 'sine';
            
            switch (type) {
                case 'start': frequency = 440; duration = 0.4; break;
                case 'select': frequency = 660; duration = 0.15; break;
                case 'move': frequency = 550; duration = 0.2; break;
                case 'capture': frequency = 880; duration = 0.3; waveType = 'sawtooth'; break;
                case 'check': frequency = 1100; duration = 0.5; waveType = 'triangle'; break;
                case 'victory': frequency = 1320; duration = 0.8; break;
                case 'evolution': frequency = 1760; duration = 0.6; break;
                case 'invalid': frequency = 220; duration = 0.25; waveType = 'square'; break;
                case 'undo': frequency = 330; duration = 0.1; break;
                case 'draw': frequency = 440; duration = 1.0; break;
                case 'cancel': frequency = 290; duration = 0.08; break;
                default: frequency = 440; duration = 0.1; break;
            }
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = waveType;
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
            
        } catch (error) {
            console.log(`Pokemon sound: ${type}`);
        }
    }

    saveGame() {
        try {
            const gameState = {
                board: this.board,
                currentTrainer: this.currentTrainer,
                gameHistory: this.gameHistory,
                moveHistory: this.moveHistory,
                capturedPokemon: this.capturedPokemon,
                battleStatus: this.battleStatus,
                kingPositions: this.kingPositions,
                moveCount: this.moveCount,
                timestamp: Date.now()
            };
            
            localStorage.setItem('pokemon-chess-battle', JSON.stringify(gameState));
        } catch (error) {
            console.error('Failed to save Pokemon battle:', error);
        }
    }

    loadSavedGame() {
        try {
            const savedGame = localStorage.getItem('pokemon-chess-battle');
            if (savedGame) {
                const gameState = JSON.parse(savedGame);
                
                if (gameState.timestamp && (Date.now() - gameState.timestamp) < 24 * 60 * 60 * 1000) {
                    this.board = gameState.board || this.createInitialBoard();
                    this.currentTrainer = gameState.currentTrainer || 'white';
                    this.gameHistory = gameState.gameHistory || [];
                    this.moveHistory = gameState.moveHistory || [];
                    this.capturedPokemon = gameState.capturedPokemon || { white: [], black: [] };
                    this.battleStatus = gameState.battleStatus || 'active';
                    this.kingPositions = gameState.kingPositions || { white: { row: 7, col: 4 }, black: { row: 0, col: 4 } };
                    this.moveCount = gameState.moveCount || 1;
                    
                    this.renderCompleteBattlefield();
                    this.updateBattleStatus();
                    this.updateBattleLog();
                    this.updateCapturedPokemon();
                    this.updateTrainerDisplay();
                }
            }
            
            const savedTheme = localStorage.getItem('pokemon-chess-theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-color-scheme', savedTheme);
                
                const themeBtn = document.getElementById('theme-toggle');
                if (themeBtn) {
                    const btnText = themeBtn.querySelector('.btn-text');
                    const btnIcon = themeBtn.querySelector('.btn-icon');
                    
                    if (btnText && btnIcon) {
                        if (savedTheme === 'dark') {
                            btnText.textContent = 'LIGHT MODE';
                            btnIcon.textContent = '☀️';
                        } else {
                            btnText.textContent = 'DARK MODE';
                            btnIcon.textContent = '🌙';
                        }
                    }
                }
            }
            
        } catch (error) {
        }
        
    } catch (error) {
        console.error('Failed to load Pokemon battle:', error);
    }
}

// OPTIMIZED: Add CSS for new animations and responsive features
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in-out {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    }
    
    .pokemon-app {
        min-height: 100vh;
        position: relative;
        overflow-x: hidden; /* Prevent horizontal scroll */
    }
    
    .hidden {
        display: none !important;
    }
    
    /* RESPONSIVE: Enhanced visual effects */
    .battle-square.check-threat {
        animation: danger-pulse 1s infinite;
        border: 2px solid #ff4444;
    }
    
    @keyframes danger-pulse {
        0%, 100% { box-shadow: 0 0 5px rgba(255, 68, 68, 0.5); }
        50% { box-shadow: 0 0 20px rgba(255, 68, 68, 0.9); }
    }
    
    .pokemon-piece.captured {
        animation: capture-effect 0.8s ease-out;
    }
    
    @keyframes capture-effect {
        0% { transform: scale(1) rotate(0deg); opacity: 1; }
        50% { transform: scale(1.3) rotate(180deg); opacity: 0.7; }
        100% { transform: scale(0) rotate(360deg); opacity: 0; }
    }
    
    /* RESPONSIVE: Mobile optimizations */
    @media (max-width: 768px) {
        .pokemon-status-display {
            top: 5% !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            max-width: 90vw !important;
            font-size: 14px !important;
        }
        
        .valid-move-indicator {
            width: 15px !important;
            height: 15px !important;
        }
        
        .battle-square:hover {
            transform: none !important; /* Disable hover effects on mobile */
        }
        
        .pokemon-piece:hover {
            transform: scale(1.05) !important; /* Reduced hover effect on mobile */
        }
    }
    
    /* PERFORMANCE: Reduce animations on low-end devices */
    @media (prefers-reduced-motion: reduce) {
        .pokemon-piece, .battle-square, .pokeball-spinner {
            animation: none !important;
            transition: none !important;
        }
    }
    
    /* RESPONSIVE: Very small screens */
    @media (max-width: 480px) {
        .pokemon-status-display {
            font-size: 12px !important;
            padding: 12px 16px !important;
        }
        
        .modal-container {
            width: 95% !important;
            padding: var(--space-20) !important;
        }
    }
`;
document.head.appendChild(style);

// OPTIMIZED: Initialize the game when DOM is loaded with performance monitoring
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const startTime = performance.now();
        window.pokemonChess = new PokemonChessBattle();
        const loadTime = performance.now() - startTime;
        console.log(`Pokemon Chess initialized in ${loadTime.toFixed(2)}ms`);
    });
} else {
    const startTime = performance.now();
    window.pokemonChess = new PokemonChessBattle();
    const loadTime = performance.now() - startTime;
    console.log(`Pokemon Chess initialized in ${loadTime.toFixed(2)}ms`);
}