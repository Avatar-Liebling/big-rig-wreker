export default class AssetGenerator {
  static generate(scene) {
    // Helper: create a graphics object, draw, generate texture, destroy
    const makeTexture = (key, w, h, drawFn) => {
      const g = scene.make.graphics({ x: 0, y: 0, add: false });
      drawFn(g, w, h);
      g.generateTexture(key, w, h);
      g.destroy();
    };

    // =========================================================================
    // 1. TRUCK (120x60) — Red semi-truck cab, top-down
    // =========================================================================
    makeTexture('truck', 120, 60, (g, w, h) => {
      // Shadow underneath - soft drop shadow
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(w/2, h/2 + 3, w - 8, h - 8);

      // Main cab body — deep red with metallic gradient effect
      g.fillStyle(0x7A0000);
      g.fillRoundedRect(0, 5, 115, 50, 6);
      
      // Mid tone body
      g.fillStyle(0xB31010);
      g.fillRoundedRect(4, 9, 107, 42, 4);
      
      // Metallic sheen — lighter red highlight strip along center
      g.fillStyle(0xFF5555, 0.5);
      g.fillRect(10, 26, 95, 8);
      
      // Darker red bottom section
      g.fillStyle(0x880000);
      g.fillRect(4, 40, 107, 11);

      // Chrome bumper at front - detailed
      g.fillStyle(0xDDDDDD);
      g.fillRect(108, 10, 10, 40);
      g.fillStyle(0xFFFFFF, 0.6);
      g.fillRect(110, 12, 4, 36);
      g.fillStyle(0x999999);
      g.fillRect(108, 10, 2, 40);
      // Bumper highlights
      g.fillStyle(0xFFFFFF, 0.3);
      g.fillRect(110, 12, 2, 36);
      g.fillRect(110, 12, 4, 2);

      // Windshield (dark blue tinted rectangle) - more realistic
      g.fillStyle(0x102040);
      g.fillRoundedRect(78, 12, 28, 36, 4);
      // Windshield glare / reflection
      g.fillStyle(0x4488CC, 0.4);
      g.fillRect(80, 14, 6, 32);
      g.fillStyle(0x66AADD, 0.2);
      g.fillRect(86, 16, 4, 28);
      // Windshield frame
      g.lineStyle(2, 0x222222, 1);
      g.strokeRoundedRect(78, 12, 28, 36, 4);

      // Side mirrors — detailed
      g.fillStyle(0x222222);
      g.fillRect(82, 0, 12, 8);
      g.fillRect(82, 52, 12, 8);
      // Mirror glass
      g.fillStyle(0x5577AA);
      g.fillRect(83, 1, 10, 6);
      g.fillRect(83, 53, 10, 6);
      // Mirror arms
      g.fillStyle(0x222222);
      g.fillRect(75, 3, 7, 2);
      g.fillRect(75, 55, 7, 2);

      // Exhaust stacks — two chrome cylinders on top of cab
      g.fillStyle(0xCCCCCC);
      g.fillCircle(68, 16, 5);
      g.fillCircle(68, 44, 5);
      g.fillStyle(0xAAAAAA);
      g.fillCircle(68, 16, 3);
      g.fillCircle(68, 44, 3);
      g.fillStyle(0xFFFFFF, 0.5);
      g.fillCircle(67, 15, 1.5);
      g.fillCircle(67, 43, 1.5);
      // Exhaust pipes going up
      g.fillStyle(0x999999);
      g.fillRect(66, 0, 4, 16);
      g.fillRect(66, 44, 4, 16);

      // Black wheels visible on sides - detailed
      g.fillStyle(0x0A0A0A);
      g.fillRect(18, 0, 20, 9);
      g.fillRect(18, 51, 20, 9);
      g.fillRect(52, 0, 20, 9);
      g.fillRect(52, 51, 20, 9);
      // Tire treads
      g.fillStyle(0x1A1A1A);
      g.fillRect(19, 1, 18, 7);
      g.fillRect(19, 52, 18, 7);
      g.fillRect(53, 1, 18, 7);
      g.fillRect(53, 52, 18, 7);
      // Wheel rims - 8-spoke style
      g.fillStyle(0x555555);
      g.fillCircle(28, 4.5, 8);
      g.fillCircle(28, 55.5, 8);
      g.fillCircle(62, 4.5, 8);
      g.fillCircle(62, 55.5, 8);
      g.fillStyle(0x777777);
      g.fillCircle(28, 4.5, 5);
      g.fillCircle(28, 55.5, 5);
      g.fillCircle(62, 4.5, 5);
      g.fillCircle(62, 55.5, 5);
      // Center caps
      g.fillStyle(0x999999);
      g.fillCircle(28, 4.5, 2);
      g.fillCircle(28, 55.5, 2);
      g.fillCircle(62, 4.5, 2);
      g.fillCircle(62, 55.5, 2);

      // Front headlights - detailed with glow
      g.fillStyle(0xFFFFAA);
      g.fillCircle(116, 18, 4);
      g.fillCircle(116, 42, 4);
      g.fillStyle(0xFFFFFF);
      g.fillCircle(117, 17.5, 2);
      g.fillCircle(117, 41.5, 2);
      // Turn signals
      g.fillStyle(0xFF8800);
      g.fillCircle(116, 12, 2);
      g.fillCircle(116, 48, 2);

      // Rear of cab details
      g.fillStyle(0x440000);
      g.fillRect(0, 10, 6, 40);
      // Tail lights
      g.fillStyle(0xFF0000);
      g.fillCircle(2, 18, 3);
      g.fillCircle(2, 42, 3);
      g.fillStyle(0xFF4444);
      g.fillCircle(2, 18, 1.5);
      g.fillCircle(2, 42, 1.5);

      // Door lines with handle
      g.lineStyle(1, 0x660000, 0.8);
      g.strokeRect(38, 12, 38, 36);
      g.fillStyle(0x888888);
      g.fillRect(68, 32, 6, 2);

      // Roof edge highlight
      g.fillStyle(0xFF6666, 0.3);
      g.fillRect(10, 10, 65, 2);
      
      // Grille details
      g.fillStyle(0x333333);
      for (let i = 0; i < 4; i++) {
        g.fillRect(112, 16 + i * 8, 4, 4);
      }
    });

    // =========================================================================
    // 2. TRAILER (100x50) — Silver/gray trailer - detailed
    // =========================================================================
    makeTexture('trailer', 100, 50, (g, w, h) => {
      // Shadow - soft drop shadow
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(w/2, h/2 + 2, w - 6, h - 6);

      // Main body — silver with metallic effect
      g.fillStyle(0x999999);
      g.fillRoundedRect(0, 3, 96, 44, 3);
      
      // Mid tone
      g.fillStyle(0xB3B3B3);
      g.fillRoundedRect(2, 5, 92, 40, 2);

      // Lighter top section - metallic highlight
      g.fillStyle(0xDDDDDD);
      g.fillRect(4, 6, 88, 18);
      g.fillStyle(0xEEEEEE, 0.4);
      g.fillRect(4, 6, 88, 4);

      // Darker bottom section
      g.fillStyle(0x888888);
      g.fillRect(4, 26, 88, 18);

      // Panel lines — vertical with rivets
      g.lineStyle(1, 0x777777, 0.8);
      for (let x = 15; x < 90; x += 12) {
        g.lineBetween(x, 5, x, 45);
        // Rivets at top and bottom
        g.fillStyle(0x666666);
        g.fillCircle(x, 8, 1.5);
        g.fillCircle(x, 42, 1.5);
        g.fillStyle(0x999999);
        g.fillCircle(x, 8, 0.5);
        g.fillCircle(x, 42, 0.5);
      }
      // Horizontal center panel line
      g.lineStyle(1, 0x777777, 0.7);
      g.lineBetween(4, 25, 92, 25);
      // Rivets on center line
      g.fillStyle(0x666666);
      for (let x = 10; x < 87; x += 12) {
        g.fillCircle(x, 25, 1.5);
        g.fillStyle(0x999999);
        g.fillCircle(x, 25, 0.5);
      }

      // Rear of trailer - detailed
      g.fillStyle(0x888888);
      g.fillRect(0, 5, 5, 40);
      g.fillStyle(0x666666);
      g.fillRect(0, 10, 3, 30);

      // Rear lights - detailed
      g.fillStyle(0xFF0000);
      g.fillCircle(2, 12, 4);
      g.fillCircle(2, 38, 4);
      g.fillStyle(0xFF4444);
      g.fillCircle(2, 12, 2);
      g.fillCircle(2, 38, 2);
      // Brake light glow
      g.fillStyle(0xFF6666, 0.5);
      g.fillCircle(2, 12, 6);
      g.fillCircle(2, 38, 6);

      // Rear reflectors (amber)
      g.fillStyle(0xFFAA00);
      g.fillRect(0, 20, 3, 5);
      g.fillRect(0, 28, 3, 5);
      g.fillStyle(0xFFCC44);
      g.fillRect(0, 21, 2, 3);
      g.fillRect(0, 29, 2, 3);

      // Wheels - detailed dual wheels
      g.fillStyle(0x0A0A0A);
      g.fillRect(8, 0, 16, 7);
      g.fillRect(8, 43, 16, 7);
      g.fillRect(28, 0, 16, 7);
      g.fillRect(28, 43, 16, 7);
      g.fillRect(48, 0, 16, 7);
      g.fillRect(48, 43, 16, 7);
      // Tire treads
      g.fillStyle(0x1A1A1A);
      g.fillRect(9, 1, 14, 5);
      g.fillRect(9, 44, 14, 5);
      g.fillRect(29, 1, 14, 5);
      g.fillRect(29, 44, 14, 5);
      g.fillRect(49, 1, 14, 5);
      g.fillRect(49, 44, 14, 5);
      // Wheel rims
      g.fillStyle(0x555555);
      g.fillCircle(16, 3.5, 6);
      g.fillCircle(16, 46.5, 6);
      g.fillCircle(36, 3.5, 6);
      g.fillCircle(36, 46.5, 6);
      g.fillCircle(56, 3.5, 6);
      g.fillCircle(56, 46.5, 6);
      g.fillStyle(0x777777);
      g.fillCircle(16, 3.5, 3.5);
      g.fillCircle(16, 46.5, 3.5);
      g.fillCircle(36, 3.5, 3.5);
      g.fillCircle(36, 46.5, 3.5);
      g.fillCircle(56, 3.5, 3.5);
      g.fillCircle(56, 46.5, 3.5);
      // Center caps
      g.fillStyle(0x999999);
      g.fillCircle(16, 3.5, 1.5);
      g.fillCircle(16, 46.5, 1.5);
      g.fillCircle(36, 3.5, 1.5);
      g.fillCircle(36, 46.5, 1.5);
      g.fillCircle(56, 3.5, 1.5);
      g.fillCircle(56, 46.5, 1.5);

      // Front hitch area - detailed fifth wheel
      g.fillStyle(0x555555);
      g.fillRect(92, 20, 8, 10);
      g.fillStyle(0x444444);
      g.fillCircle(96, 25, 4);
      g.fillStyle(0x666666);
      g.fillCircle(96, 25, 2);
      g.fillStyle(0x888888);
      g.fillCircle(96, 25, 1);

      // Top edge highlight
      g.fillStyle(0xEEEEEE, 0.5);
      g.fillRect(4, 4, 88, 2);
      
      // Mud flaps
      g.fillStyle(0x222222);
      g.fillRect(12, 42, 8, 8);
      g.fillRect(68, 42, 8, 8);
    });

    // =========================================================================
    // 3-7. CARS — Helper function for sedans
    // =========================================================================
    const drawCar = (key, w, h, bodyColor, bodyHighlight, bodyDark, isSporty, isBoxy) => {
      makeTexture(key, w, h, (g) => {
        // Shadow - soft drop shadow
        g.fillStyle(0x000000, 0.2);
        g.fillEllipse(w/2, h/2 + 2, w - 6, h - 6);

        // Main body - base color
        g.fillStyle(bodyColor);
        g.fillRoundedRect(0, 4, w - 5, h - 8, isBoxy ? 3 : 5);
        
        // Body mid tone
        g.fillStyle(bodyHighlight, 0.5);
        g.fillRoundedRect(2, 6, w - 9, h - 12, isBoxy ? 2 : 4);

        // Body highlight (top half) - metallic sheen
        g.fillStyle(bodyHighlight, 0.4);
        g.fillRect(5, 6, w - 15, Math.floor((h - 8) / 2) - 2);
        
        // Top edge highlight
        g.fillStyle(0xFFFFFF, 0.2);
        g.fillRect(5, 6, w - 15, 2);

        // Body dark shade (bottom half)
        g.fillStyle(bodyDark, 0.4);
        g.fillRect(5, Math.floor(h / 2), w - 15, Math.floor((h - 8) / 2) - 2);
        
        // Bottom edge
        g.fillStyle(0x000000, 0.2);
        g.fillRect(5, h - 10, w - 15, 2);

        // Windshield - detailed
        const wsWidth = isSporty ? 14 : (isBoxy ? 20 : 16);
        g.fillStyle(0x182848);
        g.fillRoundedRect(w - 22, 8, wsWidth, h - 16, 2);
        // Windshield glare / reflection
        g.fillStyle(0x5588BB, 0.35);
        g.fillRect(w - 20, 10, 5, h - 20);
        g.fillStyle(0x88AAEE, 0.15);
        g.fillRect(w - 18, 12, 3, h - 24);
        // Windshield frame
        g.lineStyle(1.5, 0x111111, 1);
        g.strokeRoundedRect(w - 22, 8, wsWidth, h - 16, 2);

        // Rear window
        g.fillStyle(0x182848);
        g.fillRoundedRect(8, 10, 12, h - 20, 2);
        g.fillStyle(0x5588BB, 0.25);
        g.fillRect(9, 12, 4, h - 24);
        // Rear window frame
        g.lineStyle(1.5, 0x111111, 1);
        g.strokeRoundedRect(8, 10, 12, h - 20, 2);

        // Roof panel lines
        g.lineStyle(1, bodyDark, 0.6);
        g.lineBetween(20, 8, w - 22, 8);
        g.lineBetween(20, h - 8, w - 22, h - 8);
        
        // B-pillar
        const pillarX = Math.floor(w / 2) + (isSporty ? 2 : 0);
        g.fillStyle(bodyDark);
        g.fillRect(pillarX, 8, 3, h - 16);

        // Wheels - detailed
        g.fillStyle(0x0A0A0A);
        const wheelW = isBoxy ? 10 : 8;
        const wheelH = isBoxy ? 6 : 5;
        g.fillRect(8, 0, wheelW, wheelH);
        g.fillRect(8, h - wheelH, wheelW, wheelH);
        g.fillRect(w - 22, 0, wheelW, wheelH);
        g.fillRect(w - 22, h - wheelH, wheelW, wheelH);
        // Tire tread
        g.fillStyle(0x1A1A1A);
        g.fillRect(9, 1, wheelW - 2, wheelH - 2);
        g.fillRect(9, h - wheelH + 1, wheelW - 2, wheelH - 2);
        g.fillRect(w - 21, 1, wheelW - 2, wheelH - 2);
        g.fillRect(w - 21, h - wheelH + 1, wheelW - 2, wheelH - 2);
        // Rims - circular
        const rimR = Math.max(2, Math.floor(Math.min(wheelW, wheelH) / 2) - 1);
        g.fillStyle(0x555555);
        g.fillCircle(8 + wheelW/2, wheelH/2, rimR);
        g.fillCircle(8 + wheelW/2, h - wheelH/2, rimR);
        g.fillCircle(w - 22 + wheelW/2, wheelH/2, rimR);
        g.fillCircle(w - 22 + wheelW/2, h - wheelH/2, rimR);
        g.fillStyle(0x777777);
        const innerR = Math.max(1, rimR - 2);
        g.fillCircle(8 + wheelW/2, wheelH/2, innerR);
        g.fillCircle(8 + wheelW/2, h - wheelH/2, innerR);
        g.fillCircle(w - 22 + wheelW/2, wheelH/2, innerR);
        g.fillCircle(w - 22 + wheelW/2, h - wheelH/2, innerR);
        // Center caps
        g.fillStyle(0x999999);
        g.fillCircle(8 + wheelW/2, wheelH/2, 1);
        g.fillCircle(8 + wheelW/2, h - wheelH/2, 1);
        g.fillCircle(w - 22 + wheelW/2, wheelH/2, 1);
        g.fillCircle(w - 22 + wheelW/2, h - wheelH/2, 1);

        // Headlights - detailed
        g.fillStyle(0xFFFFAA);
        g.fillCircle(w - 6, 9, 3);
        g.fillCircle(w - 6, h - 9, 3);
        g.fillStyle(0xFFFFFF);
        g.fillCircle(w - 5, 8, 1.5);
        g.fillCircle(w - 5, h - 8, 1.5);
        // Turn signals
        g.fillStyle(0xFF8800);
        g.fillCircle(w - 6, 5, 1.5);
        g.fillCircle(w - 6, h - 5, 1.5);

        // Tail lights - detailed
        g.fillStyle(0xFF0000);
        g.fillCircle(4, 9, 3);
        g.fillCircle(4, h - 9, 3);
        g.fillStyle(0xFF4444);
        g.fillCircle(4, 9, 1.5);
        g.fillCircle(4, h - 9, 1.5);
        // Brake light glow
        g.fillStyle(0xFF6666, 0.4);
        g.fillCircle(4, 9, 5);
        g.fillCircle(4, h - 9, 5);

        // Front bumper
        g.fillStyle(0xAAAAAA);
        g.fillRect(w - 6, 6, 3, h - 12);
        g.fillStyle(0xCCCCCC);
        g.fillRect(w - 5, 8, 1, h - 16);

        // Door line
        g.lineStyle(1, bodyDark, 0.5);
        g.lineBetween(Math.floor(w / 2) - 5, 8, Math.floor(w / 2) - 5, h - 8);
        // Door handle
        g.fillStyle(0x888888);
        g.fillRect(Math.floor(w / 2) - 3, Math.floor(h / 2) + 2, 4, 1);

        if (isSporty) {
          // Racing stripe
          g.fillStyle(0xFFFFFF, 0.4);
          g.fillRect(5, Math.floor(h / 2) - 1, w - 15, 2);
          g.fillStyle(0xFF0000, 0.6);
          g.fillRect(5, Math.floor(h / 2) - 1, w - 15, 1);
        }
        
        if (isBoxy) {
          // Roof rack for SUV
          g.fillStyle(0x444444);
          g.fillRect(12, 6, w - 24, 3);
          g.fillRect(12, 6, 2, h - 16);
          g.fillRect(w - 14, 6, 2, h - 16);
        }
      });
    };

    // 3. car_red (Sports sedan)
    drawCar('car_red', 60, 35, 0xCC2222, 0xFF4444, 0x881111, false, false);
    // 4. car_blue (Sedan)
    drawCar('car_blue', 60, 35, 0x2244AA, 0x4466CC, 0x112266, false, false);
    // 5. car_green (Compact)
    drawCar('car_green', 60, 35, 0x228822, 0x44BB44, 0x115511, false, false);
    // 6. car_yellow (Sports coupe)
    drawCar('car_yellow', 55, 30, 0xDDCC00, 0xFFEE44, 0xAA9900, true, false);
    // 7. car_white (SUV / Crossover)
    drawCar('car_white', 65, 40, 0xDDDDDD, 0xFFFFFF, 0xAAAAAA, false, true);

    // =========================================================================
    // 9. POLICE CAR (60x35) — Highway Interceptor
    // =========================================================================
    makeTexture('police', 60, 35, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.25);
      g.fillRoundedRect(3, 3, 57, 32, 5);

      // Main body — gloss black front and rear
      g.fillStyle(0x111318);
      g.fillRoundedRect(0, 4, 55, 27, 5);

      // White doors and roof center section (classic interceptor livery)
      g.fillStyle(0xf0f2f5);
      g.fillRect(16, 5, 24, 25);

      // Black roof panel
      g.fillStyle(0x1a1e28);
      g.fillRect(20, 9, 16, 17);

      // Windshield (tinted dark with specular glare)
      g.fillStyle(0x142038);
      g.fillRoundedRect(38, 7, 12, 21, 2);
      g.fillStyle(0x4488cc, 0.4);
      g.fillRect(40, 9, 4, 17);
      g.lineStyle(1.5, 0x111111, 1);
      g.strokeRoundedRect(38, 7, 12, 21, 2);

      // Rear window
      g.fillStyle(0x142038);
      g.fillRoundedRect(8, 9, 10, 17, 2);
      g.fillStyle(0x4488cc, 0.25);
      g.fillRect(9, 10, 3, 15);
      g.strokeRoundedRect(8, 9, 10, 17, 2);

      // Front push-bumper / bullbar (heavy-duty interceptor)
      g.fillStyle(0x222630);
      g.fillRect(54, 7, 5, 21);
      g.fillStyle(0x444b5c);
      g.fillRect(55, 11, 3, 4);
      g.fillRect(55, 20, 3, 4);

      // High-intensity low-profile LED lightbar
      g.fillStyle(0x111111);
      g.fillRect(25, 10, 8, 15);
      // Red emergency strobe
      g.fillStyle(0xff1111);
      g.fillCircle(27, 13, 3);
      g.fillStyle(0xffffff);
      g.fillCircle(27, 13, 1);
      // Strobe glow red
      g.fillStyle(0xff2222, 0.4);
      g.fillCircle(27, 13, 6);
      // Blue emergency strobe
      g.fillStyle(0x1155ff);
      g.fillCircle(27, 22, 3);
      g.fillStyle(0xffffff);
      g.fillCircle(27, 22, 1);
      // Strobe glow blue
      g.fillStyle(0x2277ff, 0.4);
      g.fillCircle(27, 22, 6);

      // Police star emblem / decal on door
      g.fillStyle(0xffcc00);
      g.fillCircle(24, 6, 2);
      g.fillCircle(24, 29, 2);

      // Wheels — black steelies with chrome center caps
      g.fillStyle(0x0a0a0a);
      g.fillRect(8, 0, 9, 5);
      g.fillRect(8, 30, 9, 5);
      g.fillRect(38, 0, 9, 5);
      g.fillRect(38, 30, 9, 5);
      g.fillStyle(0xcccccc);
      g.fillCircle(12, 2.5, 2);
      g.fillCircle(12, 32.5, 2);
      g.fillCircle(42, 2.5, 2);
      g.fillCircle(42, 32.5, 2);

      // Headlights — crisp bright xenons
      g.fillStyle(0xffffff);
      g.fillCircle(53, 9, 2.5);
      g.fillCircle(53, 26, 2.5);
      g.fillStyle(0xffffaa);
      g.fillCircle(52, 9, 1);
      g.fillCircle(52, 26, 1);

      // Tail lights
      g.fillStyle(0xff0000);
      g.fillCircle(3, 9, 2.5);
      g.fillCircle(3, 26, 2.5);
      g.fillStyle(0xff6666);
      g.fillCircle(3, 9, 1);
      g.fillCircle(3, 26, 1);
    });

    // =========================================================================
    // 9. ROAD SEGMENT (800x600)
    // =========================================================================
    makeTexture('road_segment', 800, 600, (g) => {
      // Dark asphalt base
      g.fillStyle(0x333333);
      g.fillRect(0, 0, 800, 600);

      // Subtle asphalt texture — random darker speckles
      const rng = (seed) => {
        let s = seed;
        return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
      };
      const rand = rng(42);

      for (let i = 0; i < 800; i++) {
        const x = Math.floor(rand() * 800);
        const y = Math.floor(rand() * 600);
        const shade = Math.floor(rand() * 30);
        g.fillStyle(0x222222 + shade * 0x010101, 0.3 + rand() * 0.3);
        g.fillRect(x, y, 2 + Math.floor(rand() * 3), 2 + Math.floor(rand() * 3));
      }

      // Lighter gray shoulders on left and right edges (40px each)
      g.fillStyle(0x555555);
      g.fillRect(0, 0, 40, 600);
      g.fillRect(760, 0, 40, 600);

      // Shoulder edge lines
      g.fillStyle(0x666666);
      g.fillRect(38, 0, 2, 600);
      g.fillRect(760, 0, 2, 600);

      // Curb/sidewalk texture on shoulders
      g.fillStyle(0x606060);
      for (let y = 0; y < 600; y += 30) {
        g.fillRect(0, y, 40, 1);
        g.fillRect(760, y, 40, 1);
      }

      // White solid line — road edge left
      g.fillStyle(0xDDDDDD);
      g.fillRect(42, 0, 3, 600);

      // White solid line — road edge right
      g.fillStyle(0xDDDDDD);
      g.fillRect(755, 0, 3, 600);

      // Yellow center dashed line (between lane 2 and lane 3)
      // Road area is 42..755 → ~713px, divide into 3+ lanes
      // Lane boundaries at roughly 42, 280, 520, 755
      const laneWidth = Math.floor((755 - 45) / 3); // ~236px per lane
      const lane1Right = 45 + laneWidth;     // ~281
      const lane2Right = 45 + laneWidth * 2; // ~517

      // Yellow center dashes (center of road ~400)
      const centerX = Math.floor((45 + 755) / 2); // ~400
      for (let y = 0; y < 600; y += 40) {
        g.fillStyle(0xDDCC00);
        g.fillRect(centerX - 1, y, 3, 25);
        // Slight bright center
        g.fillStyle(0xFFEE44, 0.5);
        g.fillRect(centerX, y + 2, 1, 21);
      }

      // White lane dashes — left lane divider
      for (let y = 0; y < 600; y += 50) {
        g.fillStyle(0xCCCCCC);
        g.fillRect(lane1Right - 1, y, 2, 30);
      }

      // White lane dashes — right lane divider
      for (let y = 0; y < 600; y += 50) {
        g.fillStyle(0xCCCCCC);
        g.fillRect(lane2Right - 1, y, 2, 30);
      }

      // Oil stains — random semi-transparent dark spots
      for (let i = 0; i < 8; i++) {
        const ox = 60 + Math.floor(rand() * 680);
        const oy = Math.floor(rand() * 580);
        const osize = 8 + Math.floor(rand() * 20);
        g.fillStyle(0x1a1a1a, 0.15 + rand() * 0.15);
        g.fillCircle(ox, oy, osize);
        g.fillStyle(0x111111, 0.1);
        g.fillCircle(ox + 3, oy + 2, osize * 0.7);
      }

      // Tire marks
      for (let i = 0; i < 3; i++) {
        const tx = 100 + Math.floor(rand() * 600);
        const ty = Math.floor(rand() * 500);
        g.fillStyle(0x222222, 0.12);
        g.fillRect(tx, ty, 3, 40 + Math.floor(rand() * 60));
      }
    });

    // =========================================================================
    // 10. BARRIER METAL (80x20)
    // =========================================================================
    makeTexture('barrier_metal', 80, 20, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillRect(2, 2, 80, 20);

      // Base metal
      g.fillStyle(0x888888);
      g.fillRect(0, 0, 78, 18);

      // Lighter top highlight
      g.fillStyle(0xBBBBBB);
      g.fillRect(0, 0, 78, 6);

      // Bright highlight strip
      g.fillStyle(0xDDDDDD, 0.5);
      g.fillRect(0, 2, 78, 2);

      // Darker bottom
      g.fillStyle(0x666666);
      g.fillRect(0, 12, 78, 6);

      // Bolt details
      g.fillStyle(0x555555);
      for (let x = 8; x < 78; x += 18) {
        g.fillCircle(x, 9, 2);
        g.fillStyle(0x999999, 0.5);
        g.fillCircle(x - 0.5, 8.5, 1);
        g.fillStyle(0x555555);
      }

      // Vertical support posts
      g.fillStyle(0x777777);
      g.fillRect(0, 0, 4, 18);
      g.fillRect(37, 0, 4, 18);
      g.fillRect(74, 0, 4, 18);
      g.fillStyle(0x999999);
      g.fillRect(1, 0, 1, 18);
      g.fillRect(38, 0, 1, 18);
      g.fillRect(75, 0, 1, 18);

      // Edge outline
      g.lineStyle(1, 0x444444, 0.6);
      g.strokeRect(0, 0, 78, 18);
    });

    // =========================================================================
    // 11. BARRIER CONCRETE (80x25)
    // =========================================================================
    makeTexture('barrier_concrete', 80, 25, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillRect(3, 3, 80, 25);

      // Base concrete — trapezoidal shape approximated
      g.fillStyle(0xBBBBAA);
      g.fillRect(2, 0, 76, 23);

      // Lighter top
      g.fillStyle(0xCCCCBB);
      g.fillRect(5, 0, 70, 8);

      // Concrete texture — speckles
      const rng2 = (seed) => {
        let s = seed;
        return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
      };
      const cRand = rng2(99);
      for (let i = 0; i < 60; i++) {
        const cx = Math.floor(cRand() * 76) + 2;
        const cy = Math.floor(cRand() * 23);
        g.fillStyle(0x999988, 0.2 + cRand() * 0.2);
        g.fillRect(cx, cy, 1 + Math.floor(cRand() * 2), 1 + Math.floor(cRand() * 2));
      }

      // Darker bottom edge
      g.fillStyle(0x888877);
      g.fillRect(2, 18, 76, 5);

      // Wear marks / stains
      g.fillStyle(0x777766, 0.3);
      g.fillRect(10, 5, 20, 3);
      g.fillRect(50, 10, 15, 2);

      // Edge line
      g.lineStyle(1, 0x888877, 0.5);
      g.strokeRect(2, 0, 76, 23);

      // Top highlight
      g.fillStyle(0xDDDDCC, 0.4);
      g.fillRect(5, 1, 70, 1);
    });

    // =========================================================================
    // 12. CONE (15x15)
    // =========================================================================
    makeTexture('cone', 15, 15, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillCircle(8, 9, 6);

      // Orange cone body
      g.fillStyle(0xFF6600);
      g.fillTriangle(7, 1, 2, 14, 12, 14);

      // Darker orange shade on right
      g.fillStyle(0xCC4400, 0.5);
      g.fillTriangle(7, 1, 8, 14, 12, 14);

      // White stripe
      g.fillStyle(0xFFFFFF);
      g.fillRect(4, 7, 7, 3);

      // Base
      g.fillStyle(0xDD5500);
      g.fillRect(1, 12, 12, 3);

      // Highlight
      g.fillStyle(0xFFAA44, 0.4);
      g.fillRect(4, 3, 2, 6);
    });

    // =========================================================================
    // 13. BARREL (20x20)
    // =========================================================================
    makeTexture('barrel', 20, 20, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillCircle(11, 11, 9);

      // Orange barrel body
      g.fillStyle(0xFF6600);
      g.fillCircle(10, 10, 9);

      // White stripes
      g.fillStyle(0xFFFFFF);
      g.fillRect(2, 4, 16, 3);
      g.fillRect(2, 13, 16, 3);

      // Orange middle
      g.fillStyle(0xFF7700);
      g.fillRect(2, 8, 16, 4);

      // Highlight
      g.fillStyle(0xFFAA44, 0.4);
      g.fillCircle(7, 7, 4);

      // Dark edge
      g.lineStyle(1, 0xCC4400, 0.5);
      g.strokeCircle(10, 10, 9);
    });

    // =========================================================================
    // 14. CARGO CONTAINER (60x35)
    // =========================================================================
    makeTexture('container', 60, 35, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.25);
      g.fillRoundedRect(3, 3, 54, 32, 4);

      // Container body - weathered metal
      const bodyColor = Phaser.Math.RND.pick([0x666677, 0x777766, 0x555566, 0x665555]);
      g.fillStyle(bodyColor);
      g.fillRoundedRect(0, 0, 56, 32, 4);

      // Top ridge
      g.fillStyle(0x888899);
      g.fillRect(4, 0, 48, 3);
      
      // Side corrugations
      g.lineStyle(1, 0x444455, 0.6);
      for (let x = 8; x < 48; x += 8) {
        g.lineBetween(x, 3, x, 29);
      }
      
      // Corner castings
      g.fillStyle(0x444455);
      g.fillRect(0, 0, 6, 6);
      g.fillRect(50, 0, 6, 6);
      g.fillRect(0, 26, 6, 6);
      g.fillRect(50, 26, 6, 6);
      
      // Door handles / latches
      g.fillStyle(0x333344);
      g.fillRect(8, 12, 12, 3);
      g.fillRect(36, 12, 12, 3);
      g.fillStyle(0x555566);
      g.fillRect(9, 13, 10, 1);
      g.fillRect(37, 13, 10, 1);
      
      // Hazard/reflective tape on corners
      g.fillStyle(0xff6600);
      g.fillRect(0, 2, 4, 8);
      g.fillRect(52, 2, 4, 8);
      g.fillRect(0, 22, 4, 8);
      g.fillRect(52, 22, 4, 8);
      
      // Rust spots
      g.fillStyle(0x884422, 0.4);
      for (let i = 0; i < 8; i++) {
        const rx = Phaser.Math.Between(10, 46);
        const ry = Phaser.Math.Between(8, 24);
        g.fillCircle(rx, ry, Phaser.Math.Between(1, 3));
      }
      
      // Edge highlight
      g.lineStyle(1, 0x9999aa, 0.3);
      g.strokeRoundedRect(0, 0, 56, 32, 4);
    });

    // =========================================================================
    // 15. OIL SLICK (50x40)
    // =========================================================================
    makeTexture('oil_slick', 50, 40, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.15);
      g.fillEllipse(25, 22, 44, 34);

      // Base dark puddle - simulate gradient with layered ellipses
      g.fillStyle(0x0a0a0a);
      g.fillEllipse(25, 20, 44, 34);
      g.fillStyle(0x050505);
      g.fillEllipse(25, 20, 38, 28);
      g.fillStyle(0x0a0a0a);
      g.fillEllipse(25, 20, 32, 22);

      // Rainbow iridescence - multiple ellipses
      const colors = [0xff0044, 0xff8800, 0xffff00, 0x00ff88, 0x0088ff, 0x8800ff];
      for (let i = 0; i < colors.length; i++) {
        const scale = 0.9 - i * 0.12;
        g.fillStyle(colors[i], 0.15 - i * 0.02);
        g.fillEllipse(25 + Math.sin(i) * 2, 20 + Math.cos(i) * 2, 44 * scale, 34 * scale);
      }
      
      // Specular highlights
      g.fillStyle(0xffffff, 0.08);
      g.fillEllipse(18, 14, 12, 8);
      g.fillStyle(0xffffff, 0.05);
      g.fillEllipse(32, 24, 10, 6);
      
      // Edge shimmer
      g.lineStyle(2, 0xffcc00, 0.2);
      g.strokeEllipse(25, 20, 44, 34);
      g.lineStyle(1, 0x00ffff, 0.15);
      g.strokeEllipse(25, 20, 40, 30);
    });

    // =========================================================================
    // 16. DEBRIS PILE (40x30)
    // =========================================================================
    makeTexture('debris', 40, 30, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(20, 17, 36, 22);

      // Base pile - dark rubble
      g.fillStyle(0x332211);
      g.fillEllipse(20, 15, 36, 24);
      
      // Layered debris pieces
      const debrisColors = [0x554433, 0x665544, 0x443322, 0x776655, 0x887766, 0x332211];
      for (let i = 0; i < 12; i++) {
        g.fillStyle(Phaser.Math.RND.pick(debrisColors));
        const dx = Phaser.Math.Between(6, 34);
        const dy = Phaser.Math.Between(5, 22);
        const dw = Phaser.Math.Between(4, 14);
        const dh = Phaser.Math.Between(3, 10);
        g.fillRoundedRect(dx, dy, dw, dh, 2);
      }
      
      // Metal scraps
      g.fillStyle(0x666677);
      g.fillRect(8, 10, 6, 3);
      g.fillRect(26, 8, 8, 4);
      g.fillRect(12, 18, 5, 5);
      
      // Broken glass / shiny bits
      g.fillStyle(0x88aaff, 0.6);
      g.fillCircle(15, 12, 2);
      g.fillCircle(28, 9, 1.5);
      g.fillCircle(22, 16, 2);
      
      // Oil stain
      g.fillStyle(0x000000, 0.4);
      g.fillEllipse(20, 22, 18, 8);
      
      // Highlight on top
      g.fillStyle(0x776655, 0.3);
      g.fillEllipse(18, 10, 20, 8);
      
      // Edge
      g.lineStyle(1, 0x221100, 0.5);
      g.strokeEllipse(20, 15, 36, 24);
    });

    // =========================================================================
    // 17. FUEL CANISTER (25x25)
    // =========================================================================
    makeTexture('fuel', 25, 25, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillRoundedRect(3, 3, 22, 22, 3);

      // Green canister body
      g.fillStyle(0x228822);
      g.fillRoundedRect(2, 4, 20, 19, 3);

      // Lighter green top
      g.fillStyle(0x33AA33);
      g.fillRoundedRect(2, 4, 20, 8, 3);

      // Highlight
      g.fillStyle(0x44CC44, 0.4);
      g.fillRect(5, 6, 4, 10);

      // Handle on top
      g.fillStyle(0x444444);
      g.fillRect(8, 1, 8, 4);
      g.fillStyle(0x666666);
      g.fillRect(9, 2, 6, 2);

      // Cap
      g.fillStyle(0x555555);
      g.fillCircle(18, 5, 3);
      g.fillStyle(0x777777);
      g.fillCircle(18, 5, 1.5);

      // "F" label
      g.fillStyle(0xFFFFFF);
      // F vertical bar
      g.fillRect(9, 10, 2, 10);
      // F top horizontal
      g.fillRect(9, 10, 7, 2);
      // F middle horizontal
      g.fillRect(9, 15, 5, 2);

      // Dark edge
      g.lineStyle(1, 0x115511, 0.6);
      g.strokeRoundedRect(2, 4, 20, 19, 3);
    });

    // =========================================================================
    // 15. SHIELD POWER-UP (25x25)
    // =========================================================================
    makeTexture('shield', 25, 25, (g) => {
      // Glow
      g.fillStyle(0x2266FF, 0.15);
      g.fillCircle(12, 13, 12);

      // Shield shape — approximated with triangles and rect
      g.fillStyle(0x2255CC);
      g.fillRect(4, 3, 17, 12);
      g.fillTriangle(4, 15, 12, 23, 21, 15);

      // Inner lighter shield
      g.fillStyle(0x3366DD);
      g.fillRect(6, 5, 13, 8);
      g.fillTriangle(6, 13, 12, 19, 19, 13);

      // Highlight
      g.fillStyle(0x5588FF, 0.4);
      g.fillRect(6, 5, 4, 10);

      // Star in center
      g.fillStyle(0xFFFF00);
      // Star using triangles — simplified 4-pointed star
      g.fillTriangle(12, 6, 10, 12, 14, 12); // top
      g.fillTriangle(12, 18, 10, 12, 14, 12); // bottom
      g.fillTriangle(8, 12, 12, 10, 12, 14); // left
      g.fillTriangle(16, 12, 12, 10, 12, 14); // right

      // Star center
      g.fillStyle(0xFFFFAA);
      g.fillCircle(12, 12, 1.5);

      // Shield outline
      g.lineStyle(1.5, 0x1144AA, 0.8);
      g.strokeRect(4, 3, 17, 12);
    });

    // =========================================================================
    // 16. NITRO (25x25) — Orange flame
    // =========================================================================
    makeTexture('nitro', 25, 25, (g) => {
      // Glow
      g.fillStyle(0xFF6600, 0.15);
      g.fillCircle(12, 13, 12);

      // Outer flame — orange
      g.fillStyle(0xFF5500);
      g.fillTriangle(12, 1, 3, 22, 21, 22);

      // Middle flame — yellow
      g.fillStyle(0xFFAA00);
      g.fillTriangle(12, 5, 6, 22, 18, 22);

      // Inner flame — bright yellow
      g.fillStyle(0xFFDD44);
      g.fillTriangle(12, 9, 8, 22, 16, 22);

      // Core — white hot
      g.fillStyle(0xFFFFAA);
      g.fillTriangle(12, 13, 10, 22, 14, 22);

      // Side flame tendrils
      g.fillStyle(0xFF6600, 0.6);
      g.fillTriangle(6, 8, 2, 18, 9, 16);
      g.fillTriangle(18, 8, 22, 18, 15, 16);

      // Base
      g.fillStyle(0xCC4400);
      g.fillRect(5, 20, 14, 4);
      g.fillStyle(0x884400);
      g.fillRect(5, 22, 14, 2);
    });

    // =========================================================================
    // 17. WRENCH (25x25)
    // =========================================================================
    makeTexture('wrench', 25, 25, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.15);
      g.fillCircle(13, 13, 11);

      // Wrench handle — diagonal
      g.fillStyle(0x888888);
      // Handle: rotated rect approximated with thick line or rects
      // Diagonal from bottom-left to top-right
      for (let i = 0; i < 14; i++) {
        g.fillRect(5 + i, 19 - i, 4, 4);
      }

      // Handle grip area
      g.fillStyle(0x666666);
      for (let i = 0; i < 5; i++) {
        g.fillRect(5 + i, 19 - i, 5, 5);
      }
      // Grip texture
      g.fillStyle(0x555555);
      g.fillRect(6, 20, 3, 1);
      g.fillRect(7, 18, 3, 1);
      g.fillRect(8, 16, 3, 1);

      // Wrench head at top-right
      g.fillStyle(0x999999);
      g.fillCircle(19, 6, 5);
      // Jaw opening
      g.fillStyle(0x333333);
      g.fillRect(20, 2, 5, 4);
      g.fillRect(20, 7, 5, 4);
      // Inner metal highlight
      g.fillStyle(0xBBBBBB, 0.5);
      g.fillCircle(18, 5, 2);

      // Wrench head at bottom-left
      g.fillStyle(0x999999);
      g.fillCircle(6, 20, 4);
      g.fillStyle(0x333333);
      g.fillRect(0, 18, 5, 2);
      g.fillRect(0, 21, 5, 2);
      g.fillStyle(0xBBBBBB, 0.4);
      g.fillCircle(5, 19, 1.5);

      // Metallic highlight on handle
      g.fillStyle(0xAAAAAA, 0.4);
      for (let i = 5; i < 14; i++) {
        g.fillRect(6 + i, 18 - i, 1, 3);
      }
    });

    // =========================================================================
    // 18. COIN (20x20)
    // =========================================================================
    makeTexture('coin', 20, 20, (g) => {
      // Outer glow
      g.fillStyle(0xFFDD44, 0.15);
      g.fillCircle(10, 10, 10);

      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillCircle(11, 11, 9);

      // Gold outer ring
      g.fillStyle(0xCC9900);
      g.fillCircle(10, 10, 9);

      // Gold body
      g.fillStyle(0xFFCC00);
      g.fillCircle(10, 10, 7.5);

      // Inner ring
      g.lineStyle(1, 0xCC9900, 0.5);
      g.strokeCircle(10, 10, 6);

      // Highlight — shine
      g.fillStyle(0xFFEE88, 0.6);
      g.fillCircle(7, 7, 3);

      // Bright spot
      g.fillStyle(0xFFFFCC, 0.7);
      g.fillCircle(6, 6, 1.5);

      // Dollar sign or emblem in center
      g.fillStyle(0xBB8800);
      g.fillRect(9, 5, 2, 10);
      g.fillRect(7, 6, 6, 2);
      g.fillRect(7, 12, 6, 2);

      // Dark edge
      g.lineStyle(1, 0x886600, 0.4);
      g.strokeCircle(10, 10, 9);
    });

    // =========================================================================
    // 19. EXPLOSION PARTICLE (8x8)
    // =========================================================================
    makeTexture('explosion_particle', 8, 8, (g) => {
      // Outer orange glow
      g.fillStyle(0xFF6600, 0.3);
      g.fillCircle(4, 4, 4);

      // Orange mid
      g.fillStyle(0xFF8800, 0.6);
      g.fillCircle(4, 4, 3);

      // Yellow center
      g.fillStyle(0xFFCC00, 0.8);
      g.fillCircle(4, 4, 2);

      // White hot core
      g.fillStyle(0xFFFFAA, 0.9);
      g.fillCircle(4, 4, 1);
    });

    // =========================================================================
    // 20. SMOKE PARTICLE (10x10)
    // =========================================================================
    makeTexture('smoke_particle', 10, 10, (g) => {
      g.fillStyle(0x888888, 0.15);
      g.fillCircle(5, 5, 5);

      g.fillStyle(0x999999, 0.2);
      g.fillCircle(5, 5, 4);

      g.fillStyle(0xAAAAAA, 0.25);
      g.fillCircle(5, 5, 3);

      g.fillStyle(0xBBBBBB, 0.15);
      g.fillCircle(4, 4, 2);
    });

    // =========================================================================
    // 21. SPARK PARTICLE (4x4)
    // =========================================================================
    makeTexture('spark_particle', 4, 4, (g) => {
      g.fillStyle(0xFFFF00, 0.5);
      g.fillCircle(2, 2, 2);

      g.fillStyle(0xFFFFAA, 0.8);
      g.fillCircle(2, 2, 1.2);

      g.fillStyle(0xFFFFFF, 1.0);
      g.fillCircle(2, 2, 0.5);
    });

    // =========================================================================
    // 22. DUST PARTICLE (6x6)
    // =========================================================================
    makeTexture('dust_particle', 6, 6, (g) => {
      g.fillStyle(0x8B7355, 0.15);
      g.fillCircle(3, 3, 3);

      g.fillStyle(0x9B8365, 0.2);
      g.fillCircle(3, 3, 2);

      g.fillStyle(0xAB9375, 0.15);
      g.fillCircle(3, 3, 1);
    });

    // =========================================================================
    // 23. RAIN DROP (2x8)
    // =========================================================================
    makeTexture('rain_drop', 2, 8, (g) => {
      g.fillStyle(0xAABBDD, 0.3);
      g.fillRect(0, 0, 2, 8);

      g.fillStyle(0xCCDDFF, 0.4);
      g.fillRect(0, 1, 1, 6);

      g.fillStyle(0xFFFFFF, 0.3);
      g.fillRect(0, 0, 1, 2);
    });

    // =========================================================================
    // 24. BUILDING 1 (60x80)
    // =========================================================================
    makeTexture('building_1', 60, 80, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.3);
      g.fillRect(4, 4, 60, 80);

      // Dark building silhouette
      g.fillStyle(0x2a2a3a);
      g.fillRect(0, 0, 58, 78);

      // Slightly lighter facade
      g.fillStyle(0x333344);
      g.fillRect(2, 2, 54, 74);

      // Roof darker area
      g.fillStyle(0x222233);
      g.fillRect(0, 0, 58, 6);

      // Lit windows — yellow squares (3 columns x 5 rows)
      const winColors = [0xFFDD44, 0xFFCC33, 0xFFEE66, 0xDDBB22, 0x444444];
      const wRng = rng(123);
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
          const wx = 8 + col * 16;
          const wy = 12 + row * 13;
          // Some windows lit, some dark
          const lit = wRng() > 0.3;
          if (lit) {
            const colorIdx = Math.floor(wRng() * 3);
            g.fillStyle(winColors[colorIdx]);
            g.fillRect(wx, wy, 10, 8);
            // Warm glow around window
            g.fillStyle(winColors[colorIdx], 0.15);
            g.fillRect(wx - 1, wy - 1, 12, 10);
          } else {
            g.fillStyle(0x1a1a2a);
            g.fillRect(wx, wy, 10, 8);
          }
          // Window frame
          g.lineStyle(0.5, 0x222233, 0.5);
          g.strokeRect(wx, wy, 10, 8);
        }
      }

      // Ground floor
      g.fillStyle(0x222233);
      g.fillRect(0, 72, 58, 6);
      // Door
      g.fillStyle(0x444455);
      g.fillRect(22, 68, 14, 10);
      g.fillStyle(0x555566);
      g.fillRect(24, 70, 10, 8);

      // Edge lines
      g.lineStyle(1, 0x1a1a2a, 0.5);
      g.strokeRect(0, 0, 58, 78);

      // Roof detail
      g.fillStyle(0x444455);
      g.fillRect(20, 0, 18, 3);
    });

    // =========================================================================
    // 25. BUILDING 2 (80x100)
    // =========================================================================
    makeTexture('building_2', 80, 100, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.3);
      g.fillRect(4, 4, 80, 100);

      // Building body
      g.fillStyle(0x2a2a3a);
      g.fillRect(0, 0, 78, 98);

      // Facade
      g.fillStyle(0x303042);
      g.fillRect(2, 2, 74, 94);

      // Roof
      g.fillStyle(0x222233);
      g.fillRect(0, 0, 78, 6);

      // Lit windows — 4 columns x 7 rows
      const bRng = rng(456);
      const bWinColors = [0xFFDD44, 0xFFCC33, 0xFFEE66, 0xDDBB22];
      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 4; col++) {
          const wx = 7 + col * 17;
          const wy = 10 + row * 12;
          const lit = bRng() > 0.25;
          if (lit) {
            const ci = Math.floor(bRng() * 4);
            g.fillStyle(bWinColors[ci]);
            g.fillRect(wx, wy, 10, 7);
            g.fillStyle(bWinColors[ci], 0.12);
            g.fillRect(wx - 1, wy - 1, 12, 9);
          } else {
            g.fillStyle(0x1a1a2a);
            g.fillRect(wx, wy, 10, 7);
          }
          g.lineStyle(0.5, 0x222233, 0.4);
          g.strokeRect(wx, wy, 10, 7);
        }
      }

      // Ground level
      g.fillStyle(0x222233);
      g.fillRect(0, 92, 78, 6);

      // Entrance
      g.fillStyle(0x444455);
      g.fillRect(30, 86, 18, 12);
      g.fillStyle(0xDDCC88, 0.3);
      g.fillRect(32, 88, 14, 10);

      // Ledge lines
      g.fillStyle(0x444455);
      g.fillRect(0, 45, 78, 2);

      g.lineStyle(1, 0x1a1a2a, 0.5);
      g.strokeRect(0, 0, 78, 98);
    });

    // =========================================================================
    // 26. BUILDING 3 (50x120) — Skyscraper
    // =========================================================================
    makeTexture('building_3', 50, 120, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.3);
      g.fillRect(4, 4, 50, 120);

      // Building body
      g.fillStyle(0x252535);
      g.fillRect(0, 0, 48, 118);

      // Glass facade
      g.fillStyle(0x2a2a3d);
      g.fillRect(2, 5, 44, 111);

      // Spire / antenna on top
      g.fillStyle(0x555566);
      g.fillRect(22, 0, 4, 8);
      g.fillStyle(0xFF0000);
      g.fillCircle(24, 1, 1.5);

      // Windows — 3 columns x 10 rows
      const sRng = rng(789);
      const sWinColors = [0x88BBDD, 0xFFDD44, 0xFFCC33, 0x88AACC];
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 3; col++) {
          const wx = 6 + col * 14;
          const wy = 12 + row * 10;
          const lit = sRng() > 0.2;
          if (lit) {
            const ci = Math.floor(sRng() * 4);
            g.fillStyle(sWinColors[ci]);
            g.fillRect(wx, wy, 9, 6);
            g.fillStyle(sWinColors[ci], 0.1);
            g.fillRect(wx - 1, wy - 1, 11, 8);
          } else {
            g.fillStyle(0x1a1a2a);
            g.fillRect(wx, wy, 9, 6);
          }
          g.lineStyle(0.5, 0x222233, 0.4);
          g.strokeRect(wx, wy, 9, 6);
        }
      }

      // Ground level
      g.fillStyle(0x222233);
      g.fillRect(0, 112, 48, 6);

      // Entrance
      g.fillStyle(0x444455);
      g.fillRect(16, 108, 16, 10);
      g.fillStyle(0xDDCC88, 0.2);
      g.fillRect(18, 110, 12, 8);

      // Horizontal ledges
      g.fillStyle(0x444455);
      for (let y = 35; y < 118; y += 35) {
        g.fillRect(0, y, 48, 2);
      }

      g.lineStyle(1, 0x1a1a2a, 0.5);
      g.strokeRect(0, 0, 48, 118);
    });

    // =========================================================================
    // 27. TREE (30x30) — Top-down
    // =========================================================================
    makeTexture('tree', 30, 30, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillCircle(16, 16, 13);

      // Outer canopy — medium green
      g.fillStyle(0x226622);
      g.fillCircle(15, 15, 13);

      // Mid canopy — lighter
      g.fillStyle(0x338833);
      g.fillCircle(14, 14, 10);

      // Inner canopy — lightest
      g.fillStyle(0x44AA44);
      g.fillCircle(13, 13, 7);

      // Center highlight
      g.fillStyle(0x55CC55, 0.5);
      g.fillCircle(12, 12, 4);

      // Trunk visible in center — brown dot
      g.fillStyle(0x553311);
      g.fillCircle(15, 15, 2.5);
      g.fillStyle(0x664422, 0.6);
      g.fillCircle(14, 14, 1.5);

      // Leaf texture — small variations
      g.fillStyle(0x1a5511, 0.3);
      g.fillCircle(8, 10, 3);
      g.fillCircle(20, 12, 3);
      g.fillCircle(12, 20, 3);
      g.fillCircle(18, 8, 2);

      g.fillStyle(0x55BB55, 0.25);
      g.fillCircle(10, 8, 2);
      g.fillCircle(18, 18, 2);
    });

    // =========================================================================
    // 28. LOGO (400x100) — "BIG RIG WRECKER" in blocky pixel-font
    // =========================================================================
    makeTexture('logo', 400, 100, (g) => {
      // Background — transparent, so just draw letters

      // Define each letter as an array of [x, y, w, h] rectangles (blocky pixel font)
      // Each letter fits in a 24x50 grid, scaled from 5px blocks
      const S = 5; // block size for letter construction

      // Letter definitions - each is array of [col, row, width_blocks, height_blocks]
      const letters = {
        'B': [[0,0,1,10],[1,0,4,1],[1,4,4,1],[1,9,4,1],[5,1,1,3],[5,5,1,4]],
        'I': [[0,0,5,1],[2,1,1,8],[0,9,5,1]],
        'G': [[1,0,4,1],[0,1,1,8],[1,9,4,1],[5,5,1,4],[3,5,2,1]],
        'R': [[0,0,1,10],[1,0,4,1],[5,1,1,4],[1,4,4,1],[3,5,1,1],[4,6,1,1],[5,7,1,3]],
        'W': [[0,0,1,9],[1,9,1,1],[2,7,1,2],[3,9,1,1],[4,0,1,9],[5,9,1,1]],
        'E': [[0,0,1,10],[1,0,5,1],[1,4,4,1],[1,9,5,1]],
        'C': [[1,0,5,1],[0,1,1,8],[1,9,5,1]],
        'K': [[0,0,1,10],[5,0,1,2],[4,2,1,1],[3,3,1,1],[2,4,1,2],[3,6,1,1],[4,7,1,1],[5,8,1,2]],
        ' ': [] // space
      };

      const text = 'BIG RIG WRECKER';
      let cursorX = 12; // starting X position
      const baseY = 18; // Y offset for letters

      // Shadow pass first
      for (let ci = 0; ci < text.length; ci++) {
        const ch = text[ci];
        const def = letters[ch];
        if (!def) { cursorX += 14; continue; }
        if (def.length === 0) { cursorX += 14; continue; }

        g.fillStyle(0x550000);
        for (const block of def) {
          g.fillRect(cursorX + block[0] * S + 2, baseY + block[1] * S + 2,
                     (block[2] || 1) * S, (block[3] || 1) * S);
        }
        cursorX += 7 * S + 2; // letter width + gap
      }

      // Main letters — red
      cursorX = 12;
      for (let ci = 0; ci < text.length; ci++) {
        const ch = text[ci];
        const def = letters[ch];
        if (!def) { cursorX += 14; continue; }
        if (def.length === 0) { cursorX += 14; continue; }

        // Red fill
        g.fillStyle(0xDD2222);
        for (const block of def) {
          g.fillRect(cursorX + block[0] * S, baseY + block[1] * S,
                     (block[2] || 1) * S, (block[3] || 1) * S);
        }

        // Inner highlight — lighter red on top portion
        g.fillStyle(0xFF4444, 0.5);
        for (const block of def) {
          const bh = (block[3] || 1) * S;
          g.fillRect(cursorX + block[0] * S, baseY + block[1] * S,
                     (block[2] || 1) * S, Math.floor(bh / 2));
        }

        cursorX += 7 * S + 2;
      }

      // Yellow accent underline
      g.fillStyle(0xFFCC00);
      g.fillRect(10, baseY + 55, 380, 4);
      g.fillStyle(0xFFEE44, 0.6);
      g.fillRect(10, baseY + 55, 380, 2);

      // Small yellow decorative dots at ends
      g.fillStyle(0xFFDD00);
      g.fillCircle(8, baseY + 57, 3);
      g.fillCircle(392, baseY + 57, 3);
    });

    // =========================================================================
    // 29. BUTTON (200x50)
    // =========================================================================
    makeTexture('button', 200, 50, (g) => {
      // Outer border — lighter blue
      g.fillStyle(0x3366AA);
      g.fillRoundedRect(0, 0, 200, 50, 10);

      // Dark blue fill
      g.fillStyle(0x1a3366);
      g.fillRoundedRect(2, 2, 196, 46, 9);

      // Inner body
      g.fillStyle(0x224488);
      g.fillRoundedRect(4, 4, 192, 42, 8);

      // Top highlight strip — lighter
      g.fillStyle(0x3366BB, 0.6);
      g.fillRoundedRect(6, 5, 188, 14, 6);

      // Bright top edge
      g.fillStyle(0x5588CC, 0.4);
      g.fillRect(10, 6, 180, 4);

      // Bottom darker area
      g.fillStyle(0x112244, 0.4);
      g.fillRect(6, 32, 188, 12);

      // Subtle inner glow
      g.fillStyle(0x4477BB, 0.15);
      g.fillRoundedRect(20, 10, 160, 30, 5);
    });

    // =========================================================================
    // 30. HEART (20x20)
    // =========================================================================
    makeTexture('heart', 20, 20, (g) => {
      // Heart shape using circles and triangle
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillCircle(7, 8, 5);
      g.fillCircle(14, 8, 5);
      g.fillTriangle(2, 9, 18, 9, 10, 19);

      // Deep red base
      g.fillStyle(0xCC0000);
      g.fillCircle(6, 7, 5);
      g.fillCircle(14, 7, 5);
      g.fillTriangle(1, 8, 19, 8, 10, 18);

      // Brighter red overlay
      g.fillStyle(0xEE1111);
      g.fillCircle(6, 7, 4);
      g.fillCircle(14, 7, 4);
      g.fillTriangle(3, 8, 17, 8, 10, 16);

      // Highlight
      g.fillStyle(0xFF6666, 0.6);
      g.fillCircle(5, 5, 2.5);

      // Bright spot
      g.fillStyle(0xFFAAAA, 0.5);
      g.fillCircle(5, 4, 1.2);
    });

    // =========================================================================
    // 31. STAR (20x20)
    // =========================================================================
    makeTexture('star', 20, 20, (g) => {
      // Glow
      g.fillStyle(0xFFDD00, 0.15);
      g.fillCircle(10, 10, 10);

      // Star shape — 5-pointed using overlapping triangles
      // Outer star - dark yellow shadow
      g.fillStyle(0xBB9900);
      // Top point
      g.fillTriangle(10, 0, 7, 8, 13, 8);
      // Right point
      g.fillTriangle(20, 7, 12, 7, 13, 13);
      // Bottom-right
      g.fillTriangle(16, 19, 12, 12, 10, 14);
      // Bottom-left
      g.fillTriangle(4, 19, 8, 12, 10, 14);
      // Left point
      g.fillTriangle(0, 7, 8, 7, 7, 13);

      // Bright yellow star on top
      g.fillStyle(0xFFDD00);
      g.fillTriangle(10, 1, 7.5, 7.5, 12.5, 7.5);
      g.fillTriangle(19, 7.5, 12, 7.5, 13, 12);
      g.fillTriangle(15.5, 18, 12, 11.5, 10, 13.5);
      g.fillTriangle(4.5, 18, 8, 11.5, 10, 13.5);
      g.fillTriangle(1, 7.5, 8, 7.5, 7, 12);

      // Center fill
      g.fillStyle(0xFFDD00);
      g.fillCircle(10, 10, 4);

      // Highlight
      g.fillStyle(0xFFEE66, 0.6);
      g.fillCircle(8, 7, 3);

      g.fillStyle(0xFFFFAA, 0.5);
      g.fillCircle(8, 6, 1.5);
    });

    // =========================================================================
    // 32. MINIMAP BG (150x150)
    // =========================================================================
    makeTexture('minimap_bg', 150, 150, (g) => {
      // Dark semi-transparent rounded square
      g.fillStyle(0x111122, 0.7);
      g.fillRoundedRect(0, 0, 150, 150, 12);

      // Border
      g.lineStyle(2, 0x334466, 0.8);
      g.strokeRoundedRect(1, 1, 148, 148, 12);

      // Inner border
      g.lineStyle(1, 0x223344, 0.4);
      g.strokeRoundedRect(4, 4, 142, 142, 10);

      // Subtle grid lines
      g.lineStyle(0.5, 0x223344, 0.2);
      for (let i = 15; i < 150; i += 15) {
        g.lineBetween(i, 5, i, 145);
        g.lineBetween(5, i, 145, i);
      }

      // Corner decorations
      g.fillStyle(0x334466, 0.5);
      g.fillRect(5, 5, 8, 2);
      g.fillRect(5, 5, 2, 8);
      g.fillRect(137, 5, 8, 2);
      g.fillRect(143, 5, 2, 8);
      g.fillRect(5, 143, 8, 2);
      g.fillRect(5, 137, 2, 8);
      g.fillRect(137, 143, 8, 2);
      g.fillRect(143, 137, 2, 8);
    });

    // =========================================================================
    // 33. MINIMAP PLAYER (6x6)
    // =========================================================================
    makeTexture('minimap_player', 6, 6, (g) => {
      // Bright green glow
      g.fillStyle(0x00FF00, 0.3);
      g.fillCircle(3, 3, 3);

      // Bright green dot
      g.fillStyle(0x00FF00);
      g.fillCircle(3, 3, 2.5);

      // White center
      g.fillStyle(0xAAFFAA, 0.6);
      g.fillCircle(3, 3, 1);
    });

    // =========================================================================
    // 34. MINIMAP ENEMY (4x4)
    // =========================================================================
    makeTexture('minimap_enemy', 4, 4, (g) => {
      // Red glow
      g.fillStyle(0xFF0000, 0.3);
      g.fillCircle(2, 2, 2);

      // Red dot
      g.fillStyle(0xFF0000);
      g.fillCircle(2, 2, 1.5);

      // Bright center
      g.fillStyle(0xFF6666, 0.5);
      g.fillCircle(2, 2, 0.7);
    });

    // =========================================================================
    // 35. BOSS TRUCK (140x70) — Armored Juggernaut
    // =========================================================================
    makeTexture('boss_truck', 140, 70, (g, w, h) => {
      // Menacing shadow
      g.fillStyle(0x000000, 0.4);
      g.fillRoundedRect(5, 5, w - 5, h - 5, 8);

      // Heavy armored dark steel chassis
      g.fillStyle(0x1a1c24);
      g.fillRoundedRect(0, 5, w - 8, h - 10, 6);

      // Gunmetal reinforced side armor plates
      g.fillStyle(0x2d323e);
      g.fillRoundedRect(6, 12, w - 24, h - 24, 4);

      // Armor plating welds and rivets
      g.lineStyle(2, 0x474f62, 0.9);
      for (let x = 18; x < w - 20; x += 16) {
        g.lineBetween(x, 14, x, h - 14);
        g.fillStyle(0x76829d);
        g.fillCircle(x, 15, 1.5);
        g.fillCircle(x, h - 15, 1.5);
      }

      // Spiked heavy front battering ram (Plow)
      g.fillStyle(0x111318);
      g.fillTriangle(w - 10, 6, w - 10, h - 6, w + 14, h / 2);
      g.fillStyle(0x444b5a);
      g.fillTriangle(w - 14, 12, w - 14, h - 12, w + 6, h / 2);
      // Steel spikes protruding from plow
      g.fillStyle(0xdde3ed);
      g.fillTriangle(w + 10, h / 2 - 12, w + 10, h / 2 - 8, w + 18, h / 2 - 10);
      g.fillTriangle(w + 12, h / 2 - 2, w + 12, h / 2 + 2, w + 22, h / 2);
      g.fillTriangle(w + 10, h / 2 + 8, w + 10, h / 2 + 12, w + 18, h / 2 + 10);

      // Slotted steel armored windshield
      g.fillStyle(0x0e121a);
      g.fillRect(94, 18, 16, 34);
      g.fillStyle(0x76829d);
      for (let y = 20; y <= 48; y += 5) {
        g.fillRect(94, y, 16, 2);
      }
      // Sinister red interior glow
      g.fillStyle(0xff1111, 0.4);
      g.fillRect(96, 22, 12, 26);

      // Massive dual smoking chrome chimneys / exhaust
      g.fillStyle(0x222630);
      g.fillCircle(78, 12, 6);
      g.fillCircle(78, h - 12, 6);
      g.fillStyle(0x667287);
      g.fillCircle(78, 12, 4);
      g.fillCircle(78, h - 12, 4);
      g.fillStyle(0x111111);
      g.fillCircle(78, 12, 2.5);
      g.fillCircle(78, h - 12, 2.5);

      // 8 massive treaded monster wheels
      g.fillStyle(0x08090c);
      for (const wx of [16, 42, 68, 96]) {
        g.fillRect(wx, 0, 18, 8);
        g.fillRect(wx, h - 8, 18, 8);
        g.fillStyle(0x3a4252);
        g.fillCircle(wx + 9, 4, 3);
        g.fillCircle(wx + 9, h - 4, 3);
        g.fillStyle(0x08090c);
      }

      // Menacing Crimson Quad Headlights
      g.fillStyle(0xff0000);
      g.fillCircle(w - 8, 14, 4);
      g.fillCircle(w - 8, h - 14, 4);
      g.fillStyle(0xffffff);
      g.fillCircle(w - 7, 14, 1.5);
      g.fillCircle(w - 7, h - 14, 1.5);
      // Red menacing glow
      g.fillStyle(0xff2222, 0.5);
      g.fillCircle(w - 6, 14, 8);
      g.fillCircle(w - 6, h - 14, 8);

      // Bold hazard orange "BOSS" emblazoned on armored roof
      g.fillStyle(0xff5500);
      // B
      g.fillRect(24, 24, 3, 22);
      g.fillRect(27, 24, 9, 3);
      g.fillRect(36, 27, 3, 7);
      g.fillRect(27, 34, 9, 3);
      g.fillRect(36, 37, 3, 6);
      g.fillRect(27, 43, 9, 3);
      // O
      g.fillRect(42, 24, 11, 3);
      g.fillRect(42, 43, 11, 3);
      g.fillRect(42, 24, 3, 22);
      g.fillRect(50, 24, 3, 22);
      // S
      g.fillRect(56, 24, 10, 3);
      g.fillRect(56, 24, 3, 11);
      g.fillRect(56, 34, 10, 3);
      g.fillRect(63, 34, 3, 12);
      g.fillRect(56, 43, 10, 3);
      // S
      g.fillRect(69, 24, 10, 3);
      g.fillRect(69, 24, 3, 11);
      g.fillRect(69, 34, 10, 3);
      g.fillRect(76, 34, 3, 12);
      g.fillRect(69, 43, 10, 3);
    });

    // =========================================================================
    // 36. BIG RIG (110x55) — Upgraded semi with longer cab
    // =========================================================================
    makeTexture('big_rig', 110, 55, (g, w, h) => {
      // Shadow
      g.fillStyle(0x000000, 0.3);
      g.fillRoundedRect(3, 3, w - 3, h - 3, 6);

      // Main cab body — deep crimson with metallic flake
      g.fillStyle(0x5a0000);
      g.fillRoundedRect(0, 5, w - 8, h - 10, 5);
      
      // Metallic mid tone
      g.fillStyle(0x990000);
      g.fillRoundedRect(3, 8, w - 14, h - 16, 4);
      
      // Highlight stripe
      g.fillStyle(0xff3333, 0.4);
      g.fillRect(12, 25, w - 30, 6);
      
      // Chrome front bumper - massive
      g.fillStyle(0xdddddd);
      g.fillRect(w - 8, 8, 6, 39);
      g.fillStyle(0xffffff, 0.5);
      g.fillRect(w - 6, 10, 2, 35);
      
      // Grille - aggressive
      g.fillStyle(0x111111);
      g.fillRect(w - 10, 12, 4, 31);
      g.fillStyle(0x333333);
      for (let i = 0; i < 5; i++) {
        g.fillRect(w - 9, 14 + i * 6, 2, 3);
      }

      // Windshield - larger, tinted
      g.fillStyle(0x081020);
      g.fillRoundedRect(70, 10, 35, 35, 3);
      g.fillStyle(0x3377bb, 0.3);
      g.fillRect(73, 13, 8, 29);
      g.fillStyle(0x5599dd, 0.15);
      g.fillRect(81, 15, 4, 25);

      // Side mirrors - larger
      g.fillStyle(0x1a1a1a);
      g.fillRect(76, 3, 15, 5);
      g.fillRect(76, h - 8, 15, 5);
      g.fillStyle(0x446688);
      g.fillRect(77, 4, 13, 3);
      g.fillRect(77, h - 7, 13, 3);

      // Dual exhaust stacks - chrome
      g.fillStyle(0xbbbbbb);
      g.fillCircle(58, 10, 5);
      g.fillCircle(58, h - 10, 5);
      g.fillStyle(0x999999);
      g.fillCircle(58, 10, 3);
      g.fillCircle(58, h - 10, 3);
      g.fillStyle(0xffffff, 0.4);
      g.fillCircle(57, 9, 1.5);
      g.fillCircle(57, h - 9, 1.5);
      // Exhaust pipes
      g.fillStyle(0x888888);
      g.fillRect(56, 0, 4, 10);
      g.fillRect(56, h - 10, 4, 10);

      // Massive wheels - 10 wheels visible
      g.fillStyle(0x080808);
      for (const wx of [18, 40, 64, 86]) {
        g.fillRect(wx, 0, 20, 8);
        g.fillRect(wx, h - 8, 20, 8);
        // Tread
        g.fillStyle(0x1a1a1a);
        g.fillRect(wx + 1, 1, 18, 6);
        g.fillRect(wx + 1, h - 7, 18, 6);
        // Rims
        g.fillStyle(0x444444);
        g.fillCircle(wx + 10, 4, 7);
        g.fillCircle(wx + 10, h - 4, 7);
        g.fillStyle(0x666666);
        g.fillCircle(wx + 10, 4, 4);
        g.fillCircle(wx + 10, h - 4, 4);
        g.fillStyle(0x888888);
        g.fillCircle(wx + 10, 4, 1.5);
        g.fillCircle(wx + 10, h - 4, 1.5);
        g.fillStyle(0x080808);
      }

      // Quad LED headlights - bright white
      g.fillStyle(0xffffee);
      g.fillCircle(w - 2, 14, 4);
      g.fillCircle(w - 2, h - 14, 4);
      g.fillStyle(0xffffff);
      g.fillCircle(w - 1, 13.5, 2);
      g.fillCircle(w - 1, h - 13.5, 2);
      // DRL strips
      g.fillStyle(0xffffee, 0.6);
      g.fillRect(w - 12, 10, 8, 2);
      g.fillRect(w - 12, h - 12, 8, 2);

      // "BIG RIG" text on roof
      g.fillStyle(0xffcc00);
      g.fillRect(18, 22, 3, 11);
      g.fillRect(18, 22, 8, 2);
      g.fillRect(26, 22, 2, 11);
      g.fillRect(18, 33, 10, 2);
      g.fillRect(18, 27, 8, 2);
      // I
      g.fillRect(32, 22, 2, 11);
      // G
      g.fillRect(37, 22, 8, 2);
      g.fillRect(37, 22, 2, 11);
      g.fillRect(37, 33, 8, 2);
      g.fillRect(45, 27, 2, 6);
      // R
      g.fillRect(50, 22, 2, 11);
      g.fillRect(50, 22, 8, 2);
      g.fillRect(58, 22, 2, 6);
      g.fillRect(50, 27, 8, 2);
      g.fillRect(58, 27, 2, 6);
      // I
      g.fillRect(63, 22, 2, 11);
      // G
      g.fillRect(68, 22, 8, 2);
      g.fillRect(68, 22, 2, 11);
      g.fillRect(68, 33, 8, 2);
      g.fillRect(76, 27, 2, 6);

      // Rear cab details
      g.fillStyle(0x330000);
      g.fillRect(0, 8, 5, 39);
      g.fillStyle(0xff0000);
      g.fillCircle(2, 15, 3);
      g.fillCircle(2, h - 15, 3);
    });

    // =========================================================================
    // 37. LARGE TRAILER (115x55) — Extended trailer for big rig
    // =========================================================================
    makeTexture('trailer_large', 115, 55, (g, w, h) => {
      // Shadow
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(w/2, h/2 + 2, w - 4, h - 4);

      // Main body - silver metallic
      g.fillStyle(0x999999);
      g.fillRoundedRect(0, 3, w - 4, h - 6, 3);
      
      g.fillStyle(0xbbbbbb);
      g.fillRoundedRect(2, 5, w - 8, h - 10, 2);

      // Top highlight
      g.fillStyle(0xdddddd);
      g.fillRect(4, 7, w - 12, 20);
      g.fillStyle(0xeeeeee, 0.4);
      g.fillRect(4, 7, w - 12, 5);

      // Bottom shadow
      g.fillStyle(0x888888);
      g.fillRect(4, 28, w - 12, 20);

      // Panel lines with rivets
      g.lineStyle(1, 0x777777, 0.8);
      for (let x = 15; x < w - 15; x += 14) {
        g.lineBetween(x, 7, x, h - 7);
        g.fillStyle(0x666666);
        g.fillCircle(x, 10, 1.5);
        g.fillCircle(x, h - 10, 1.5);
        g.fillStyle(0x999999);
        g.fillCircle(x, 10, 0.5);
        g.fillCircle(x, h - 10, 0.5);
      }
      // Center horizontal
      g.lineStyle(1, 0x777777, 0.7);
      g.lineBetween(6, h/2, w - 6, h/2);

      // Rear - detailed
      g.fillStyle(0x888888);
      g.fillRect(0, 7, 5, h - 14);
      g.fillStyle(0xff0000);
      g.fillCircle(2, 14, 4);
      g.fillCircle(2, h - 14, 4);
      g.fillStyle(0xff4444);
      g.fillCircle(2, 14, 2);
      g.fillCircle(2, h - 14, 2);

      // Wheels - 12 wheels (3 axles dual)
      g.fillStyle(0x0a0a0a);
      for (const wx of [16, 38, 60, 82, 98]) {
        g.fillRect(wx, 0, 18, 7);
        g.fillRect(wx, h - 7, 18, 7);
        g.fillStyle(0x1a1a1a);
        g.fillRect(wx + 1, 1, 16, 5);
        g.fillRect(wx + 1, h - 6, 16, 5);
        g.fillStyle(0x444444);
        g.fillCircle(wx + 9, 3.5, 5.5);
        g.fillCircle(wx + 9, h - 3.5, 5.5);
        g.fillStyle(0x666666);
        g.fillCircle(wx + 9, 3.5, 3);
        g.fillCircle(wx + 9, h - 3.5, 3);
        g.fillStyle(0x888888);
        g.fillCircle(wx + 9, 3.5, 1);
        g.fillCircle(wx + 9, h - 3.5, 1);
        g.fillStyle(0x0a0a0a);
      }
    });

    // =========================================================================
    // 38. ROAD TRAIN (130x65) — Multi-trailer heavy hauler
    // =========================================================================
    makeTexture('road_train', 130, 65, (g, w, h) => {
      // Shadow
      g.fillStyle(0x000000, 0.35);
      g.fillRoundedRect(4, 4, w - 4, h - 4, 8);

      // Main cab - matte black with orange accents
      g.fillStyle(0x0a0a0c);
      g.fillRoundedRect(0, 5, w - 10, h - 10, 6);
      
      // Dark gunmetal body
      g.fillStyle(0x1e2228);
      g.fillRoundedRect(4, 9, w - 18, h - 18, 4);
      
      // Orange accent stripe
      g.fillStyle(0xff6600);
      g.fillRect(14, 30, w - 40, 5);
      g.fillStyle(0xff8800, 0.3);
      g.fillRect(14, 35, w - 40, 2);

      // Massive bull bar
      g.fillStyle(0x111111);
      g.fillRect(w - 10, 12, 8, 41);
      g.fillStyle(0x333333);
      g.fillRect(w - 8, 14, 4, 37);
      // Bull bar spikes
      g.fillStyle(0xdddddd);
      for (let i = 0; i < 4; i++) {
        g.fillTriangle(w, 20 + i * 8, w - 4, 17 + i * 8, w - 4, 23 + i * 8);
      }

      // Windshield - narrow, armored
      g.fillStyle(0x05080e);
      g.fillRect(85, 15, 30, 35);
      g.fillStyle(0x224466, 0.2);
      g.fillRect(88, 18, 6, 29);
      // Armor slats
      g.fillStyle(0x445566);
      for (let y = 18; y < 50; y += 4) {
        g.fillRect(85, y, 30, 1);
      }

      // Mirrors - heavy duty
      g.fillStyle(0x111111);
      g.fillRect(88, 5, 18, 6);
      g.fillRect(88, h - 11, 18, 6);
      g.fillStyle(0x335577);
      g.fillRect(89, 6, 16, 4);
      g.fillRect(89, h - 10, 16, 4);

      // Triple exhaust stacks
      g.fillStyle(0x222222);
      g.fillCircle(72, 12, 6);
      g.fillCircle(72, h/2, 6);
      g.fillCircle(72, h - 12, 6);
      g.fillStyle(0x444444);
      g.fillCircle(72, 12, 4);
      g.fillCircle(72, h/2, 4);
      g.fillCircle(72, h - 12, 4);
      g.fillStyle(0x111111);
      g.fillCircle(72, 12, 2);
      g.fillCircle(72, h/2, 2);
      g.fillCircle(72, h - 12, 2);
      // Pipes going up
      g.fillStyle(0x333333);
      g.fillRect(70, 0, 4, 12);
      g.fillRect(70, h/2 - 2, 4, 12);
      g.fillRect(70, h - 12, 4, 12);

      // Massive wheels - 16 wheels
      g.fillStyle(0x050505);
      for (const wx of [20, 44, 68, 92, 116]) {
        g.fillRect(wx, 0, 22, 9);
        g.fillRect(wx, h - 9, 22, 9);
        g.fillStyle(0x1a1a1a);
        g.fillRect(wx + 1, 1, 20, 7);
        g.fillRect(wx + 1, h - 8, 20, 7);
        g.fillStyle(0x333333);
        g.fillCircle(wx + 11, 4.5, 8);
        g.fillCircle(wx + 11, h - 4.5, 8);
        g.fillStyle(0x555555);
        g.fillCircle(wx + 11, 4.5, 5);
        g.fillCircle(wx + 11, h - 4.5, 5);
        g.fillStyle(0x777777);
        g.fillCircle(wx + 11, 4.5, 1.5);
        g.fillCircle(wx + 11, h - 4.5, 1.5);
        g.fillStyle(0x050505);
      }

      // LED light bar on roof
      g.fillStyle(0xff3300);
      g.fillRect(20, 8, w - 60, 3);
      g.fillStyle(0xff6600, 0.5);
      g.fillRect(20, 6, w - 60, 2);

      // "ROAD TRAIN" on side
      g.fillStyle(0xffcc00);
      const text = 'ROAD TRAIN';
      let tx = 15;
      for (const ch of text) {
        if (ch === 'R') {
          g.fillRect(tx, 42, 2, 10);
          g.fillRect(tx, 42, 6, 2);
          g.fillRect(tx + 6, 42, 2, 5);
          g.fillRect(tx, 47, 6, 2);
          g.fillRect(tx + 6, 47, 2, 5);
        } else if (ch === 'O') {
          g.fillRect(tx, 42, 6, 2);
          g.fillRect(tx, 52, 6, 2);
          g.fillRect(tx, 42, 2, 10);
          g.fillRect(tx + 6, 42, 2, 10);
        } else if (ch === 'A') {
          g.fillRect(tx, 42, 6, 2);
          g.fillRect(tx, 42, 2, 10);
          g.fillRect(tx + 6, 42, 2, 10);
          g.fillRect(tx, 47, 6, 2);
        } else if (ch === 'D') {
          g.fillRect(tx, 42, 2, 10);
          g.fillRect(tx, 42, 6, 2);
          g.fillRect(tx, 52, 6, 2);
          g.fillRect(tx + 6, 42, 2, 10);
        } else if (ch === 'T') {
          g.fillRect(tx, 42, 8, 2);
          g.fillRect(tx + 3, 42, 2, 10);
        } else if (ch === 'R') {
          g.fillRect(tx, 42, 2, 10);
          g.fillRect(tx, 42, 6, 2);
          g.fillRect(tx + 6, 42, 2, 5);
          g.fillRect(tx, 47, 6, 2);
          g.fillRect(tx + 6, 47, 2, 5);
        } else if (ch === 'A') {
          g.fillRect(tx, 42, 6, 2);
          g.fillRect(tx, 42, 2, 10);
          g.fillRect(tx + 6, 42, 2, 10);
          g.fillRect(tx, 47, 6, 2);
        } else if (ch === 'I') {
          g.fillRect(tx, 42, 2, 10);
        } else if (ch === 'N') {
          g.fillRect(tx, 42, 2, 10);
          g.fillRect(tx + 6, 42, 2, 10);
          g.fillRect(tx, 42, 6, 2);
          g.fillRect(tx, 52, 6, 2);
        }
        tx += (ch === 'I' ? 5 : 9);
      }

      // Quad headlights - orange/white
      g.fillStyle(0xffffcc);
      g.fillCircle(w - 4, 18, 4);
      g.fillCircle(w - 4, h - 18, 4);
      g.fillStyle(0xff8800);
      g.fillCircle(w - 4, 13, 3);
      g.fillCircle(w - 4, h - 13, 3);
      g.fillStyle(0xffffff);
      g.fillCircle(w - 3, 17.5, 1.5);
      g.fillCircle(w - 3, h - 17.5, 1.5);
    });

    // =========================================================================
    // 39. ROAD TRAIN TRAILER (135x65) — Extended trailer
    // =========================================================================
    makeTexture('trailer_roadtrain', 135, 65, (g, w, h) => {
      // Shadow
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(w/2, h/2 + 3, w - 6, h - 6);

      // Main body - dark metallic
      g.fillStyle(0x2a2e36);
      g.fillRoundedRect(0, 5, w - 6, h - 10, 4);
      
      g.fillStyle(0x3d444f);
      g.fillRoundedRect(3, 8, w - 12, h - 16, 3);

      // Orange accent
      g.fillStyle(0xff6600);
      g.fillRect(8, 12, w - 20, 3);
      g.fillRect(8, h - 15, w - 20, 3);

      // Panel lines
      g.lineStyle(1, 0x222222, 0.9);
      for (let x = 18; x < w - 18; x += 16) {
        g.lineBetween(x, 10, x, h - 10);
        g.fillStyle(0x555555);
        g.fillCircle(x, 13, 1.5);
        g.fillCircle(x, h - 13, 1.5);
      }

      // Rear
      g.fillStyle(0x1a1a1a);
      g.fillRect(0, 8, 6, h - 16);
      g.fillStyle(0xff0000);
      g.fillCircle(3, 16, 5);
      g.fillCircle(3, h - 16, 5);
      g.fillStyle(0xff4444);
      g.fillCircle(3, 16, 2.5);
      g.fillCircle(3, h - 16, 2.5);

      // Wheels - 16 wheels
      g.fillStyle(0x050505);
      for (const wx of [18, 40, 62, 84, 106, 122]) {
        g.fillRect(wx, 0, 20, 8);
        g.fillRect(wx, h - 8, 20, 8);
        g.fillStyle(0x1a1a1a);
        g.fillRect(wx + 1, 1, 18, 6);
        g.fillRect(wx + 1, h - 7, 18, 6);
        g.fillStyle(0x333333);
        g.fillCircle(wx + 10, 4, 7);
        g.fillCircle(wx + 10, h - 4, 7);
        g.fillStyle(0x555555);
        g.fillCircle(wx + 10, 4, 4);
        g.fillCircle(wx + 10, h - 4, 4);
        g.fillStyle(0x777777);
        g.fillCircle(wx + 10, 4, 1);
        g.fillCircle(wx + 10, h - 4, 1);
        g.fillStyle(0x050505);
      }
    });

    // =========================================================================
    // 40. JUGGERNAUT (150x75) — Ultimate heavy hauler
    // =========================================================================
    makeTexture('juggernaut', 150, 75, (g, w, h) => {
      // Intense shadow
      g.fillStyle(0x000000, 0.4);
      g.fillRoundedRect(5, 5, w - 5, h - 5, 10);

      // Cab - obsidian black with gold trim
      g.fillStyle(0x050508);
      g.fillRoundedRect(0, 5, w - 12, h - 10, 8);
      
      // Carbon fiber texture body
      g.fillStyle(0x101018);
      g.fillRoundedRect(6, 12, w - 24, h - 24, 6);
      
      // Gold accent stripes
      g.fillStyle(0xffcc00);
      g.fillRect(20, 35, w - 60, 2);
      g.fillRect(20, 40, w - 60, 2);
      g.fillStyle(0xffdd44, 0.3);
      g.fillRect(20, 33, w - 60, 1);
      g.fillRect(20, 42, w - 60, 1);

      // Massive reinforced bull bar
      g.fillStyle(0x0a0a0a);
      g.fillRect(w - 12, 15, 10, 45);
      g.fillStyle(0x222222);
      g.fillRect(w - 10, 17, 6, 41);
      // Gold spikes
      g.fillStyle(0xffcc00);
      for (let i = 0; i < 5; i++) {
        g.fillTriangle(w, 22 + i * 7, w - 5, 19 + i * 7, w - 5, 25 + i * 7);
      }
      g.fillStyle(0xffdd44, 0.5);
      for (let i = 0; i < 5; i++) {
        g.fillTriangle(w - 2, 22 + i * 7, w - 4, 19 + i * 7, w - 4, 25 + i * 7);
      }

      // Armored windshield - narrow slit
      g.fillStyle(0x020408);
      g.fillRect(100, 20, 38, 35);
      // Gold frame
      g.fillStyle(0xffcc00);
      g.lineStyle(2, 0xffcc00, 1);
      g.strokeRect(100, 20, 38, 35);
      // Armor slats
      g.fillStyle(0x334455);
      for (let y = 22; y < 53; y += 3) {
        g.fillRect(102, y, 34, 1);
      }
      // Red interior glow
      g.fillStyle(0xff1111, 0.3);
      g.fillRect(104, 24, 30, 27);

      // Heavy mirrors
      g.fillStyle(0x0a0a0a);
      g.fillRect(105, 8, 22, 7);
      g.fillRect(105, h - 15, 22, 7);
      g.fillStyle(0x335577);
      g.fillRect(106, 9, 20, 5);
      g.fillRect(106, h - 14, 20, 5);

      // Quad exhaust stacks
      g.fillStyle(0x111111);
      for (const ey of [14, h/2 - 6, h/2 + 6, h - 14]) {
        g.fillCircle(84, ey, 7);
        g.fillStyle(0x333333);
        g.fillCircle(84, ey, 5);
        g.fillStyle(0x111111);
        g.fillCircle(84, ey, 2);
        g.fillStyle(0x0a0a0a);
      }
      // Exhaust pipes
      g.fillStyle(0x222222);
      g.fillRect(82, 0, 4, 14);
      g.fillRect(82, h/2 - 14, 4, 28);
      g.fillRect(82, h - 14, 4, 14);

      // Massive wheels - 20 wheels
      g.fillStyle(0x020202);
      for (const wx of [22, 46, 70, 94, 118, 142]) {
        g.fillRect(wx, 0, 24, 10);
        g.fillRect(wx, h - 10, 24, 10);
        g.fillStyle(0x0a0a0a);
        g.fillRect(wx + 1, 1, 22, 8);
        g.fillRect(wx + 1, h - 9, 22, 8);
        g.fillStyle(0x222222);
        g.fillCircle(wx + 12, 5, 9);
        g.fillCircle(wx + 12, h - 5, 9);
        g.fillStyle(0x444444);
        g.fillCircle(wx + 12, 5, 6);
        g.fillCircle(wx + 12, h - 5, 6);
        g.fillStyle(0xffcc00);
        g.fillCircle(wx + 12, 5, 2);
        g.fillCircle(wx + 12, h - 5, 2);
        g.fillStyle(0x020202);
      }

      // LED light bar - full width
      g.fillStyle(0xffcc00);
      g.fillRect(22, 10, w - 68, 2);
      g.fillStyle(0xffdd44, 0.4);
      g.fillRect(22, 8, w - 68, 2);

      // "JUGGERNAUT" on side
      g.fillStyle(0xffcc00);
      const text = 'JUGGERNAUT';
      let tx = 18;
      for (const ch of text) {
        if (ch === 'J') {
          g.fillRect(tx, 48, 6, 2);
          g.fillRect(tx + 4, 48, 2, 12);
          g.fillRect(tx, 60, 6, 2);
        } else if (ch === 'U') {
          g.fillRect(tx, 48, 2, 12);
          g.fillRect(tx + 6, 48, 2, 12);
          g.fillRect(tx, 60, 6, 2);
        } else if (ch === 'G') {
          g.fillRect(tx, 48, 6, 2);
          g.fillRect(tx, 60, 6, 2);
          g.fillRect(tx, 48, 2, 12);
          g.fillRect(tx + 6, 54, 2, 6);
        } else if (ch === 'G') {
          g.fillRect(tx, 48, 6, 2);
          g.fillRect(tx, 60, 6, 2);
          g.fillRect(tx, 48, 2, 12);
          g.fillRect(tx + 6, 54, 2, 6);
        } else if (ch === 'E') {
          g.fillRect(tx, 48, 6, 2);
          g.fillRect(tx, 48, 2, 12);
          g.fillRect(tx, 54, 4, 2);
          g.fillRect(tx, 60, 6, 2);
        } else if (ch === 'R') {
          g.fillRect(tx, 48, 2, 12);
          g.fillRect(tx, 48, 6, 2);
          g.fillRect(tx + 6, 48, 2, 6);
          g.fillRect(tx, 54, 6, 2);
          g.fillRect(tx + 6, 54, 2, 6);
        } else if (ch === 'N') {
          g.fillRect(tx, 48, 2, 12);
          g.fillRect(tx + 6, 48, 2, 12);
          g.fillRect(tx, 48, 6, 2);
          g.fillRect(tx, 60, 6, 2);
        } else if (ch === 'A') {
          g.fillRect(tx, 48, 6, 2);
          g.fillRect(tx, 48, 2, 12);
          g.fillRect(tx + 6, 48, 2, 12);
          g.fillRect(tx, 54, 6, 2);
        } else if (ch === 'U') {
          g.fillRect(tx, 48, 2, 12);
          g.fillRect(tx + 6, 48, 2, 12);
          g.fillRect(tx, 60, 6, 2);
        } else if (ch === 'T') {
          g.fillRect(tx, 48, 8, 2);
          g.fillRect(tx + 3, 48, 2, 12);
        }
        tx += (ch === 'I' ? 5 : 9);
      }

      // Quad headlights - gold/white
      g.fillStyle(0xffffee);
      g.fillCircle(w - 6, 22, 5);
      g.fillCircle(w - 6, h - 22, 5);
      g.fillStyle(0xffcc00);
      g.fillCircle(w - 6, 17, 3.5);
      g.fillCircle(w - 6, h - 17, 3.5);
      g.fillStyle(0xffffff);
      g.fillCircle(w - 5, 21.5, 2);
      g.fillCircle(w - 5, h - 21.5, 2);
      // DRL
      g.fillStyle(0xffcc00, 0.5);
      g.fillRect(w - 16, 18, 8, 2);
      g.fillRect(w - 16, h - 20, 8, 2);
    });

    // =========================================================================
    // 41. MASSIVE TRAILER (155x80) — Ultimate trailer
    // =========================================================================
    makeTexture('trailer_massive', 155, 80, (g, w, h) => {
      // Shadow
      g.fillStyle(0x000000, 0.3);
      g.fillEllipse(w/2, h/2 + 4, w - 8, h - 8);

      // Main body - obsidian with carbon texture
      g.fillStyle(0x0a0a0e);
      g.fillRoundedRect(0, 6, w - 8, h - 12, 6);
      
      g.fillStyle(0x14141c);
      g.fillRoundedRect(4, 10, w - 16, h - 20, 4);

      // Gold trim
      g.fillStyle(0xffcc00);
      g.fillRect(10, 14, w - 20, 2);
      g.fillRect(10, h - 16, w - 20, 2);
      g.fillStyle(0xffdd44, 0.2);
      g.fillRect(10, 16, w - 20, 1);
      g.fillRect(10, h - 17, w - 20, 1);

      // Panel lines with gold rivets
      g.lineStyle(1, 0x111111, 1);
      for (let x = 20; x < w - 20; x += 18) {
        g.lineBetween(x, 12, x, h - 12);
        g.fillStyle(0xffcc00);
        g.fillCircle(x, 15, 1.5);
        g.fillCircle(x, h - 15, 1.5);
      }

      // Rear - heavy armored
      g.fillStyle(0x050505);
      g.fillRect(0, 10, 8, h - 20);
      g.fillStyle(0xff0000);
      g.fillCircle(4, 20, 6);
      g.fillCircle(4, h - 20, 6);
      g.fillStyle(0xff4444);
      g.fillCircle(4, 20, 3);
      g.fillCircle(4, h - 20, 3);
      // Gold reflector
      g.fillStyle(0xffcc00);
      g.fillRect(0, h/2 - 8, 4, 16);

      // Wheels - 24 wheels (6 axles dual)
      g.fillStyle(0x020202);
      for (const wx of [20, 42, 64, 86, 108, 130, 148]) {
        g.fillRect(wx, 0, 22, 9);
        g.fillRect(wx, h - 9, 22, 9);
        g.fillStyle(0x0a0a0a);
        g.fillRect(wx + 1, 1, 20, 7);
        g.fillRect(wx + 1, h - 8, 20, 7);
        g.fillStyle(0x1a1a1a);
        g.fillCircle(wx + 11, 4.5, 8);
        g.fillCircle(wx + 11, h - 4.5, 8);
        g.fillStyle(0x333333);
        g.fillCircle(wx + 11, 4.5, 5);
        g.fillCircle(wx + 11, h - 4.5, 5);
        g.fillStyle(0xffcc00);
        g.fillCircle(wx + 11, 4.5, 1.5);
        g.fillCircle(wx + 11, h - 4.5, 1.5);
        g.fillStyle(0x020202);
      }
    });

    // =========================================================================
    // 36. TANKER TRUCK (110x55) — Explosive hazard
    // =========================================================================
    makeTexture('tanker', 110, 55, (g, w, h) => {
      // Shadow
      g.fillStyle(0x000000, 0.25);
      g.fillRoundedRect(3, 3, w - 3, h - 3, 6);

      // Cab front (cab over engine / conventional)
      g.fillStyle(0x3a2210);
      g.fillRoundedRect(72, 8, 36, 39, 4);
      g.fillStyle(0x5a3418);
      g.fillRoundedRect(74, 10, 32, 35, 3);
      // Cab roof highlight
      g.fillStyle(0x7a4822);
      g.fillRect(75, 12, 18, 31);
      // Windshield
      g.fillStyle(0x18243c);
      g.fillRoundedRect(88, 12, 16, 31, 2);
      g.fillStyle(0x4488cc, 0.4);
      g.fillRect(90, 14, 5, 27);
      // Chrome bumper & grille
      g.fillStyle(0xcccccc);
      g.fillRect(106, 12, 4, 31);
      g.fillStyle(0xeeeeee);
      g.fillRect(107, 14, 2, 27);
      // Chrome exhaust stack
      g.fillStyle(0x999999);
      g.fillCircle(75, 12, 3);
      g.fillCircle(75, 43, 3);
      g.fillStyle(0xdddddd);
      g.fillCircle(75, 12, 1.5);
      g.fillCircle(75, 43, 1.5);

      // Cylindrical Tank body — brushed stainless steel
      g.fillStyle(0x787d85);
      g.fillRoundedRect(2, 9, 72, 37, 6);
      // Tank 3D metallic highlights (top reflection)
      g.fillStyle(0xcfd4dc);
      g.fillRect(4, 13, 66, 8);
      g.fillStyle(0xffffff, 0.5);
      g.fillRect(4, 15, 66, 3);
      // Tank lower shadow (belly)
      g.fillStyle(0x4d525a);
      g.fillRect(4, 33, 66, 11);
      // Tank weld rings / baffles
      g.lineStyle(1.5, 0x5a6068, 0.9);
      g.lineBetween(18, 9, 18, 46);
      g.lineBetween(38, 9, 38, 46);
      g.lineBetween(58, 9, 58, 46);
      // Catwalk down spine
      g.fillStyle(0x3a3d42);
      g.fillRect(8, 26, 56, 3);
      // Dome inspection hatches
      g.fillStyle(0x888e96);
      g.fillCircle(28, 27, 4);
      g.fillCircle(48, 27, 4);
      g.fillStyle(0xdddddd);
      g.fillCircle(28, 27, 2);
      g.fillCircle(48, 27, 2);

      // Flammable placard (diamond hazard symbol)
      g.fillStyle(0xdd1111);
      g.fillRect(8, 14, 8, 8);
      g.fillStyle(0xffffff);
      g.fillRect(9, 15, 6, 6);
      g.fillStyle(0xdd1111);
      g.fillRect(10, 16, 4, 4);

      // Heavy duty wheels
      g.fillStyle(0x0c0c0c);
      g.fillRect(10, 2, 16, 7);
      g.fillRect(10, h - 9, 16, 7);
      g.fillRect(32, 2, 16, 7);
      g.fillRect(32, h - 9, 16, 7);
      g.fillRect(52, 2, 16, 7);
      g.fillRect(52, h - 9, 16, 7);
      g.fillRect(84, 2, 16, 7);
      g.fillRect(84, h - 9, 16, 7);
      // Chrome hubcaps
      g.fillStyle(0x888888);
      for (const wx of [18, 40, 60, 92]) {
        g.fillCircle(wx, 5, 2.5);
        g.fillCircle(wx, h - 5.5, 2.5);
        g.fillStyle(0xcccccc);
        g.fillCircle(wx, 5, 1);
        g.fillCircle(wx, h - 5.5, 1);
        g.fillStyle(0x888888);
      }
      // Headlights & Taillights
      g.fillStyle(0xffffcc);
      g.fillCircle(107, 16, 2.5);
      g.fillCircle(107, 39, 2.5);
      g.fillStyle(0xff1111);
      g.fillCircle(3, 14, 2.5);
      g.fillCircle(3, 41, 2.5);
    });

    // =========================================================================
    // 37. MOTORCYCLE (35x18) — Fast traffic
    // =========================================================================
    makeTexture('motorcycle', 35, 18, (g, w, h) => {
      // Soft shadow
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(w / 2, h / 2 + 1, w - 2, h - 3);

      // Front tire & fork
      g.fillStyle(0x111111);
      g.fillRoundedRect(w - 7, 7, 6, 4, 1.5);
      g.fillStyle(0x888888);
      g.fillRect(w - 9, 6, 3, 6);

      // Rear tire
      g.fillStyle(0x111111);
      g.fillRoundedRect(1, 6, 7, 6, 2);

      // Main frame & engine block
      g.fillStyle(0x222228);
      g.fillRect(8, 5, 18, 8);
      // Chrome engine cooling fins
      g.fillStyle(0x777788);
      g.fillRect(10, 6, 8, 2);
      g.fillRect(10, 10, 8, 2);

      // Chrome exhaust pipe
      g.fillStyle(0xcccccc);
      g.fillRect(6, 13, 16, 2);
      g.fillStyle(0x555555);
      g.fillRect(4, 13, 2, 2);

      // Aerodynamic fairing / bodywork (Sportbike red)
      g.fillStyle(0xd91414);
      g.fillTriangle(w - 12, 4, w - 12, 14, w - 2, 9);
      g.fillRect(14, 5, 10, 8);

      // Tinted windscreen
      g.fillStyle(0x1a2e4a);
      g.fillTriangle(w - 10, 6, w - 10, 12, w - 5, 9);

      // Clip-on handlebars & mirrors
      g.fillStyle(0x111111);
      g.fillRect(w - 11, 2, 2, 14);
      g.fillCircle(w - 10, 2, 1.5);
      g.fillCircle(w - 10, 16, 1.5);

      // Rider in leather suit leaning forward
      g.fillStyle(0x1f232c);
      g.fillEllipse(17, 9, 10, 6);
      // Helmet (matching bodywork with visor)
      g.fillStyle(0xd91414);
      g.fillCircle(20, 9, 3.5);
      g.fillStyle(0x111111);
      g.fillRect(21, 7.5, 3, 3);

      // Bright halogen headlight
      g.fillStyle(0xffffcc);
      g.fillCircle(w - 2, 9, 2);
      // Tail light
      g.fillStyle(0xff1111);
      g.fillCircle(2, 9, 1.5);
    });

    // =========================================================================
    // 38. AMBULANCE (60x35) — Emergency vehicle
    // =========================================================================
    makeTexture('ambulance', 60, 35, (g) => {
      const w = 60;
      const h = 35;
      // Shadow
      g.fillStyle(0x000000, 0.25);
      g.fillRoundedRect(3, 3, w - 3, h - 3, 5);

      // Crisp white chassis
      g.fillStyle(0xf4f6f8);
      g.fillRoundedRect(0, 4, w - 4, h - 8, 4);

      // Paramedic red stripes along side
      g.fillStyle(0xd61c1c);
      g.fillRect(5, 5, w - 12, 3);
      g.fillRect(5, h - 8, w - 12, 3);

      // High-visibility rear chevron pattern (safety stripes)
      for (let i = 0; i < 4; i++) {
        g.fillStyle(0xd61c1c);
        g.fillRect(1, 6 + i * 6, 4, 3);
        g.fillStyle(0xffcc00);
        g.fillRect(1, 9 + i * 6, 4, 3);
      }

      // Cab windshield
      g.fillStyle(0x142238);
      g.fillRoundedRect(40, 8, 12, 19, 2);
      g.fillStyle(0x4488cc, 0.35);
      g.fillRect(42, 10, 4, 15);
      g.lineStyle(1, 0x111111, 0.8);
      g.strokeRoundedRect(40, 8, 12, 19, 2);

      // Side paramedic windows
      g.fillStyle(0x142238);
      g.fillRect(14, 6, 18, 3);
      g.fillRect(14, h - 9, 18, 3);

      // Red Star of Life / Medical cross on roof
      g.fillStyle(0xd61c1c);
      g.fillRect(20, 11, 8, 13);
      g.fillRect(15, 14, 18, 7);
      g.fillStyle(0xffffff);
      g.fillRect(22, 13, 4, 9);
      g.fillRect(17, 16, 14, 3);

      // Roof emergency lightbar (pulsing red/blue/white)
      g.fillStyle(0x111111);
      g.fillRect(36, 10, 5, 15);
      g.fillStyle(0xff1111);
      g.fillCircle(38, 12, 2.5);
      g.fillStyle(0x1166ff);
      g.fillCircle(38, 23, 2.5);
      g.fillStyle(0xffffff);
      g.fillCircle(38, 17.5, 1.5);
      // Strobe halos
      g.fillStyle(0xff2222, 0.35);
      g.fillCircle(38, 12, 5);
      g.fillStyle(0x2288ff, 0.35);
      g.fillCircle(38, 23, 5);

      // Heavy duty wheels
      g.fillStyle(0x111111);
      g.fillRect(8, 0, 11, 5);
      g.fillRect(8, h - 5, 11, 5);
      g.fillRect(38, 0, 11, 5);
      g.fillRect(38, h - 5, 11, 5);
      g.fillStyle(0x888888);
      g.fillCircle(13, 2.5, 2);
      g.fillCircle(13, h - 2.5, 2);
      g.fillCircle(43, 2.5, 2);
      g.fillCircle(43, h - 2.5, 2);

      // Headlights & bumper
      g.fillStyle(0xcccccc);
      g.fillRect(w - 5, 7, 3, 21);
      g.fillStyle(0xffffcc);
      g.fillCircle(w - 4, 10, 2);
      g.fillCircle(w - 4, 25, 2);
    });

    // =========================================================================
    // 39. FIRE TRUCK (70x40) — Big emergency
    // =========================================================================
    makeTexture('firetruck', 70, 40, (g) => {
      const w = 70;
      const h = 40;
      // Shadow
      g.fillStyle(0x000000, 0.3);
      g.fillRoundedRect(4, 4, w - 4, h - 4, 5);

      // Main cab & body — Fire Engine Red
      g.fillStyle(0xb51212);
      g.fillRoundedRect(0, 5, w - 4, h - 10, 5);

      // Gold leaf accent pinstripe along side
      g.fillStyle(0xffcc00);
      g.fillRect(6, 6, w - 14, 2);
      g.fillRect(6, h - 8, w - 14, 2);

      // Chrome diamond-plate side panels
      g.fillStyle(0x88929e);
      g.fillRect(16, 7, 30, 3);
      g.fillRect(16, h - 10, 30, 3);

      // Large cab windshield
      g.fillStyle(0x142036);
      g.fillRoundedRect(48, 9, 14, 22, 2);
      g.fillStyle(0x4488cc, 0.4);
      g.fillRect(50, 11, 5, 18);
      g.lineStyle(1.5, 0x111111, 1);
      g.strokeRoundedRect(48, 9, 14, 22, 2);

      // Roof aluminum extension ladder with detailed rungs
      g.fillStyle(0x333b45);
      g.fillRect(4, 13, 44, 14);
      g.fillStyle(0xcccccc);
      g.fillRect(4, 13, 44, 2);
      g.fillRect(4, 25, 44, 2);
      for (let x = 8; x <= 44; x += 4) {
        g.fillRect(x, 15, 2, 10);
      }

      // Chrome brass water cannon / deck gun
      g.fillStyle(0xddaa22);
      g.fillCircle(46, 20, 3);
      g.fillRect(46, 19, 7, 2);

      // Chrome air horns on cab
      g.fillStyle(0xeeeeee);
      g.fillRect(46, 8, 8, 2);
      g.fillRect(46, h - 10, 8, 2);

      // Emergency roof lightbar (dual strobes + siren)
      g.fillStyle(0x222222);
      g.fillRect(44, 14, 4, 12);
      g.fillStyle(0xff1111);
      g.fillCircle(46, 15, 3);
      g.fillCircle(46, 25, 3);
      g.fillStyle(0xffffff);
      g.fillCircle(46, 15, 1);
      g.fillCircle(46, 25, 1);
      // Light bloom
      g.fillStyle(0xff2222, 0.4);
      g.fillCircle(46, 15, 6);
      g.fillCircle(46, 25, 6);

      // Triple axle (6 heavy duty wheels)
      g.fillStyle(0x0e0e0e);
      g.fillRect(10, 1, 13, 5);
      g.fillRect(10, h - 6, 13, 5);
      g.fillRect(26, 1, 13, 5);
      g.fillRect(26, h - 6, 13, 5);
      g.fillRect(46, 1, 13, 5);
      g.fillRect(46, h - 6, 13, 5);
      // Wheel rims
      g.fillStyle(0x888888);
      for (const wx of [16, 32, 52]) {
        g.fillCircle(wx, 3.5, 2.5);
        g.fillCircle(wx, h - 3.5, 2.5);
        g.fillStyle(0xdddddd);
        g.fillCircle(wx, 3.5, 1);
        g.fillCircle(wx, h - 3.5, 1);
        g.fillStyle(0x888888);
      }

      // Heavy chrome front bumper & headlights
      g.fillStyle(0xdddddd);
      g.fillRect(w - 5, 8, 3, 24);
      g.fillStyle(0xffffff);
      g.fillCircle(w - 4, 12, 2.5);
      g.fillCircle(w - 4, 28, 2.5);
    });

    // =========================================================================
    // 40. PICKUP TRUCK (65x35) — 4x4 Off-Road
    // =========================================================================
    makeTexture('pickup', 65, 35, (g) => {
      const w = 65;
      const h = 35;
      const colors = [0x2244aa, 0x1d6a2d, 0xaa2d1d, 0xb88814, 0x3d434d];
      const bodyColor = colors[Math.floor(Math.random() * colors.length)];

      // Shadow
      g.fillStyle(0x000000, 0.25);
      g.fillRoundedRect(3, 3, w - 3, h - 3, 5);

      // 4x4 body base
      g.fillStyle(bodyColor);
      g.fillRoundedRect(0, 4, w - 4, h - 8, 4);

      // Cab section
      g.fillStyle(bodyColor);
      g.fillRoundedRect(28, 5, 32, 25, 4);

      // Windshield
      g.fillStyle(0x142036);
      g.fillRoundedRect(42, 8, 14, 19, 2);
      g.fillStyle(0x4488cc, 0.35);
      g.fillRect(44, 10, 4, 15);
      g.lineStyle(1.5, 0x111111, 1);
      g.strokeRoundedRect(42, 8, 14, 19, 2);

      // Rear cab window
      g.fillStyle(0x142036);
      g.fillRect(29, 9, 3, 17);

      // Truck bed with textured liner
      g.fillStyle(0x181a1f);
      g.fillRect(4, 7, 24, 21);

      // Cargo in bed: diamond plate toolbox + cargo crate + spare tire
      // Toolbox
      g.fillStyle(0x88929e);
      g.fillRect(20, 8, 7, 19);
      g.fillStyle(0x505760);
      g.fillRect(23, 9, 2, 17);
      // Wooden cargo crate
      g.fillStyle(0x8b5a2b);
      g.fillRect(6, 8, 11, 11);
      g.lineStyle(1, 0x5a3418, 0.8);
      g.strokeRect(6, 8, 11, 11);
      g.lineBetween(6, 8, 17, 19);
      // Spare tire in bed
      g.fillStyle(0x0e0e0e);
      g.fillCircle(12, 23, 4.5);
      g.fillStyle(0x444444);
      g.fillCircle(12, 23, 2);

      // Chrome roll bar behind cab
      g.fillStyle(0xdddddd);
      g.fillRect(26, 6, 2, 23);
      g.fillCircle(27, 11, 1.5);
      g.fillCircle(27, 24, 1.5);

      // Aggressive off-road wheels
      g.fillStyle(0x0a0a0a);
      g.fillRect(8, 0, 13, 6);
      g.fillRect(8, h - 6, 13, 6);
      g.fillRect(42, 0, 13, 6);
      g.fillRect(42, h - 6, 13, 6);
      // Beadlock alloy rims
      g.fillStyle(0x444444);
      g.fillCircle(14, 3, 3);
      g.fillCircle(14, h - 3, 3);
      g.fillCircle(48, 3, 3);
      g.fillCircle(48, h - 3, 3);
      g.fillStyle(0x999999);
      g.fillCircle(14, 3, 1.5);
      g.fillCircle(14, h - 3, 1.5);
      g.fillCircle(48, 3, 1.5);
      g.fillCircle(48, h - 3, 1.5);

      // Bumper & Headlights
      g.fillStyle(0x333b45);
      g.fillRect(w - 5, 6, 4, 23);
      g.fillStyle(0xffffcc);
      g.fillCircle(w - 4, 9, 2.5);
      g.fillCircle(w - 4, 26, 2.5);
      // Tailgate & lights
      g.fillStyle(0xff1111);
      g.fillCircle(2, 7, 2);
      g.fillCircle(2, 28, 2);
    });

    // =========================================================================
    // 41. SPORTS CAR LOW (55x28) — Hypercar / Exotic
    // =========================================================================
    makeTexture('sports_low', 55, 28, (g) => {
      const w = 55;
      const h = 28;
      const colors = [0xd61414, 0x18bb24, 0x1455d6, 0xeecc00, 0x9914d6, 0xf0f2f5];
      const bodyColor = colors[Math.floor(Math.random() * colors.length)];

      // Shadow
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(w / 2, h / 2 + 1, w - 2, h - 3);

      // Sleek sculpted widebody
      g.fillStyle(bodyColor);
      g.fillRoundedRect(2, 3, w - 4, h - 6, 4);

      // Side aerodynamic scoops (air intakes)
      g.fillStyle(0x141820);
      g.fillRect(16, 3, 10, 2);
      g.fillRect(16, h - 5, 10, 2);

      // Jet-fighter canopy (tinted dark with reflections)
      g.fillStyle(0x101a2e);
      g.fillRoundedRect(18, 6, 22, 16, 5);
      g.fillStyle(0x4488cc, 0.4);
      g.fillTriangle(30, 8, 30, 20, 38, 14);

      // Dual racing bucket seats inside
      g.fillStyle(0xd61414);
      g.fillRect(22, 8, 5, 4);
      g.fillRect(22, 16, 5, 4);

      // Carbon fiber rear wing spoiler with endplates
      g.fillStyle(0x15181f);
      g.fillRect(3, 3, 4, h - 6);
      g.fillRect(2, 2, 6, 3);
      g.fillRect(2, h - 5, 6, 3);

      // Quad exhaust pipes in center rear
      g.fillStyle(0x8899aa);
      g.fillCircle(2, 12, 1.5);
      g.fillCircle(2, 16, 1.5);

      // Large alloy wheels with visible brake calipers
      g.fillStyle(0x0a0a0a);
      g.fillRect(9, 0, 10, 5);
      g.fillRect(9, h - 5, 10, 5);
      g.fillRect(35, 0, 10, 5);
      g.fillRect(35, h - 5, 10, 5);
      // Red Brembo calipers
      g.fillStyle(0xff1111);
      g.fillRect(10, 1, 2, 3);
      g.fillRect(10, h - 4, 2, 3);
      g.fillRect(36, 1, 2, 3);
      g.fillRect(36, h - 4, 2, 3);
      // Alloy rims
      g.fillStyle(0xcccccc);
      g.fillCircle(14, 2.5, 2);
      g.fillCircle(14, h - 2.5, 2);
      g.fillCircle(40, 2.5, 2);
      g.fillCircle(40, h - 2.5, 2);

      // Aggressive LED headlights
      g.fillStyle(0xffffff);
      g.fillCircle(w - 4, 6, 2);
      g.fillCircle(w - 4, h - 6, 2);
      g.fillStyle(0x88ccff);
      g.fillCircle(w - 3, 6, 1);
      g.fillCircle(w - 3, h - 6, 1);
    });

    // =========================================================================
    // 42. BUS (85x40) — City Transit / Coach
    // =========================================================================
    makeTexture('bus', 85, 40, (g) => {
      const w = 85;
      const h = 40;
      // Shadow
      g.fillStyle(0x000000, 0.3);
      g.fillRoundedRect(4, 4, w - 4, h - 4, 5);

      // Clean bright transit yellow body
      g.fillStyle(0xf0b800);
      g.fillRoundedRect(0, 4, w - 4, h - 8, 4);

      // Accent color stripe (deep navy blue)
      g.fillStyle(0x182c54);
      g.fillRect(4, 10, w - 10, 2);
      g.fillRect(4, h - 12, w - 10, 2);

      // Front panoramic windshield
      g.fillStyle(0x142036);
      g.fillRoundedRect(64, 8, 16, 24, 2);
      g.fillStyle(0x4488cc, 0.35);
      g.fillRect(66, 10, 5, 20);

      // Digital route destination sign ("EXPRESS")
      g.fillStyle(0x111111);
      g.fillRect(72, 13, 4, 14);
      g.fillStyle(0xffaa00);
      g.fillRect(73, 14, 2, 12);

      // Passenger panoramic tinted windows with frame posts
      for (let x = 8; x < 60; x += 9) {
        g.fillStyle(0x142036);
        g.fillRect(x, 6, 7, 4);
        g.fillRect(x, h - 10, 7, 4);
        // Commuter silhouettes inside
        g.fillStyle(0x3a4860);
        g.fillCircle(x + 3.5, 8, 1.5);
        g.fillCircle(x + 3.5, h - 8, 1.5);
      }

      // Bi-fold passenger entry doors
      g.fillStyle(0x223048);
      g.fillRect(52, 4, 9, 3);
      g.lineStyle(1, 0xdddddd, 0.6);
      g.lineBetween(56, 4, 56, 7);

      // Rooftop air conditioning climate pods
      g.fillStyle(0xd9dadf);
      g.fillRoundedRect(20, 14, 16, 12, 3);
      g.fillRoundedRect(42, 14, 16, 12, 3);
      g.fillStyle(0x8c8e96);
      g.fillRect(22, 16, 12, 2);
      g.fillRect(22, 22, 12, 2);
      g.fillRect(44, 16, 12, 2);
      g.fillRect(44, 22, 12, 2);

      // Heavy transit wheels (dual rear)
      g.fillStyle(0x0e0e0e);
      g.fillRect(12, 0, 15, 5);
      g.fillRect(12, h - 5, 15, 5);
      g.fillRect(28, 0, 15, 5);
      g.fillRect(28, h - 5, 15, 5);
      g.fillRect(58, 0, 15, 5);
      g.fillRect(58, h - 5, 15, 5);
      // Hubcaps
      g.fillStyle(0x777777);
      for (const wx of [19, 35, 65]) {
        g.fillCircle(wx, 2.5, 2);
        g.fillCircle(wx, h - 2.5, 2);
      }

      // Headlights & Taillights
      g.fillStyle(0xffffff);
      g.fillCircle(w - 4, 10, 2.5);
      g.fillCircle(w - 4, 30, 2.5);
      g.fillStyle(0xff1111);
      g.fillCircle(2, 9, 2);
      g.fillCircle(2, 31, 2);
    });

    // =========================================================================
    // 43. HELICOPTER (50x50) — Air hazard
    // =========================================================================
    makeTexture('helicopter', 50, 50, (g) => {
      // Shadow (on ground)
      g.fillStyle(0x000000, 0.15);
      g.fillEllipse(25, 42, 40, 10);

      // Body
      g.fillStyle(0x333344);
      g.fillRoundedRect(12, 15, 26, 20, 4);
      // Cockpit glass
      g.fillStyle(0x224488);
      g.fillRoundedRect(12, 16, 14, 15, 3);
      // Tail boom
      g.fillStyle(0x444455);
      g.fillRect(38, 22, 10, 4);
      // Tail rotor
      g.fillStyle(0x666666);
      g.fillRect(46, 20, 2, 8);

      // Main rotor (blurred)
      g.fillStyle(0x888888, 0.3);
      g.fillEllipse(25, 10, 48, 4);
      g.fillEllipse(25, 10, 4, 48);
      // Rotor hub
      g.fillStyle(0x222222);
      g.fillCircle(25, 10, 3);

      // Skids
      g.fillStyle(0x555555);
      g.fillRect(10, 33, 30, 2);
      g.fillRect(14, 31, 2, 4);
      g.fillRect(36, 31, 2, 4);
    });

    // =========================================================================
    // 44. DRONE (20x20) — Small air power-up carrier
    // =========================================================================
    makeTexture('drone', 20, 20, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.1);
      g.fillEllipse(10, 18, 16, 4);

      // Body
      g.fillStyle(0x222233);
      g.fillRect(7, 7, 6, 6);
      // Arms
      g.fillStyle(0x333344);
      g.fillRect(0, 9, 7, 2);
      g.fillRect(13, 9, 7, 2);
      g.fillRect(9, 0, 2, 7);
      g.fillRect(9, 13, 2, 7);
      // Props (blurred)
      g.fillStyle(0x8888aa, 0.4);
      g.fillCircle(3, 9, 5);
      g.fillCircle(17, 9, 5);
      g.fillCircle(9, 3, 5);
      g.fillCircle(9, 17, 5);
      // Center light
      g.fillStyle(0x00ffcc);
      g.fillCircle(10, 10, 2);
    });

    // =========================================================================
    // 45. CARGO CONTAINER (60x35) — Falling obstacle
    // =========================================================================
    makeTexture('container', 60, 35, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.3);
      g.fillRoundedRect(3, 3, 54, 32, 3);

      // Container body
      g.fillStyle(0x665533);
      g.fillRect(0, 0, 58, 35);
      // Corner castings
      g.fillStyle(0x443311);
      g.fillRect(0, 0, 6, 6);
      g.fillRect(52, 0, 6, 6);
      g.fillRect(0, 29, 6, 6);
      g.fillRect(52, 29, 6, 6);
      // Door lines
      g.lineStyle(2, 0x443311, 0.8);
      g.lineBetween(28, 2, 28, 33);
      // Handles
      g.fillStyle(0x887755);
      g.fillRect(20, 14, 6, 2);
      g.fillRect(20, 19, 6, 2);
      g.fillRect(34, 14, 6, 2);
      g.fillRect(34, 19, 6, 2);
      // Warning stripes on top
      g.fillStyle(0xffff00);
      for (let x = 4; x < 54; x += 6) {
        g.fillRect(x, 2, 3, 3);
      }
    });

    // =========================================================================
    // 46. COIN ANIMATED FRAMES (20x20 x 8 frames)
    // =========================================================================
    for (let frame = 0; frame < 8; frame++) {
      const angle = (frame / 8) * Math.PI * 2;
      const scaleX = Math.abs(Math.cos(angle));
      makeTexture(`coin_${frame}`, 20, 20, (g) => {
        // Glow
        g.fillStyle(0xFFDD00, 0.2);
        g.fillCircle(10, 10, 10);
        // Coin body
        g.fillStyle(0xFFCC00);
        g.fillEllipse(10, 10, 16 * scaleX, 16);
        // Edge
        g.fillStyle(0xBB8800);
        g.fillEllipse(10, 10, 18 * scaleX, 18);
        // Inner detail
        g.fillStyle(0xFFDD44);
        g.fillEllipse(10, 10, 10 * scaleX, 10);
        // $ sign
        g.fillStyle(0x886600);
        g.fillRect(9, 5, 2, 10);
        g.fillRect(7, 7, 6, 2);
        g.fillRect(7, 13, 6, 2);
      });
    }

    // =========================================================================
    // 47. SHIELD BUBBLE (40x40) — Shield effect
    // =========================================================================
    makeTexture('shield_bubble', 40, 40, (g) => {
      // Outer glow
      g.fillStyle(0x0088FF, 0.15);
      g.fillCircle(20, 20, 20);
      // Shield ring
      g.lineStyle(3, 0x00AAFF, 0.6);
      g.strokeCircle(20, 20, 18);
      // Inner glow
      g.lineStyle(2, 0x66DDFF, 0.4);
      g.strokeCircle(20, 20, 14);
      // Hexagon pattern
      g.lineStyle(1, 0x0088FF, 0.2);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const x1 = 20 + Math.cos(a) * 16;
        const y1 = 20 + Math.sin(a) * 16;
        const x2 = 20 + Math.cos(a) * 10;
        const y2 = 20 + Math.sin(a) * 10;
        g.lineBetween(x1, y1, x2, y2);
      }
    });

    // =========================================================================
    // 48. NITRO FLAME (30x40) — Boost effect
    // =========================================================================
    makeTexture('nitro_flame', 30, 40, (g) => {
      // Base flame
      g.fillStyle(0xFF4400);
      g.fillTriangle(15, 40, 0, 0, 30, 0);
      // Middle
      g.fillStyle(0xFF8800);
      g.fillTriangle(15, 35, 4, 8, 26, 8);
      // Inner
      g.fillStyle(0xFFCC00);
      g.fillTriangle(15, 28, 7, 12, 23, 12);
      // Core
      g.fillStyle(0xFFFF88);
      g.fillTriangle(15, 20, 9, 16, 21, 16);
      // Tip
      g.fillStyle(0xFFFFFF);
      g.fillCircle(15, 12, 3);
    });

    // =========================================================================
    // 49. EXPLOSION RING (60x60) — Big explosion
    // =========================================================================
    makeTexture('explosion_ring', 60, 60, (g) => {
      // Outer ring
      g.fillStyle(0xFF4400, 0.3);
      g.fillCircle(30, 30, 30);
      g.fillStyle(0xFF8800, 0.4);
      g.fillCircle(30, 30, 24);
      g.fillStyle(0xFFCC00, 0.5);
      g.fillCircle(30, 30, 18);
      g.fillStyle(0xFFFF88, 0.6);
      g.fillCircle(30, 30, 12);
      g.fillStyle(0xFFFFFF, 0.7);
      g.fillCircle(30, 30, 6);
    });

    // =========================================================================
    // 50. LEVEL UP BANNER (400x100)
    // =========================================================================
    makeTexture('levelup_banner', 400, 100, (g) => {
      // Background
      g.fillStyle(0x000000, 0.85);
      g.fillRoundedRect(0, 0, 400, 100, 16);
      g.lineStyle(4, 0xFFCC00, 1);
      g.strokeRoundedRect(2, 2, 396, 96, 14);
      // Gold trim
      g.fillStyle(0xFFCC00);
      g.fillRoundedRect(4, 4, 392, 8, 10);
      g.fillRoundedRect(4, 88, 392, 8, 10);
      // "LEVEL UP" text (blocky)
      g.fillStyle(0xFF4400);
      const letters = 'LEVELUP';
      let x = 50;
      for (const ch of letters) {
        if (ch === 'L') {
          g.fillRect(x, 20, 4, 40);
          g.fillRect(x, 56, 20, 4);
        } else if (ch === 'E') {
          g.fillRect(x, 20, 20, 4);
          g.fillRect(x, 20, 4, 20);
          g.fillRect(x, 40, 16, 4);
          g.fillRect(x, 56, 20, 4);
        } else if (ch === 'V') {
          g.fillRect(x, 20, 4, 30);
          g.fillRect(x+16, 20, 4, 30);
          g.fillTriangle(x, 50, x+10, 50, x+20, 56);
        } else if (ch === 'U') {
          g.fillRect(x, 20, 4, 36);
          g.fillRect(x+16, 20, 4, 36);
          g.fillRect(x, 56, 20, 4);
        } else if (ch === 'P') {
          g.fillRect(x, 20, 4, 36);
          g.fillRect(x, 20, 16, 4);
          g.fillRect(x, 38, 16, 4);
          g.fillRect(x+16, 20, 4, 18);
        }
        x += 28;
      }
      x += 20;
      // "UP"
      g.fillRect(x, 20, 4, 36);
      g.fillRect(x+16, 20, 4, 36);
      g.fillRect(x, 56, 20, 4);
    });

    // Helper RNG function used by buildings and road (defined inline for building usage)
    function rng(seed) {
      let s = seed;
      return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
    }
  }
}
