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
      // Shadow underneath
      g.fillStyle(0x000000, 0.3);
      g.fillRoundedRect(4, 4, 116, 56, 6);

      // Main cab body — deep red
      g.fillStyle(0x8B0000);
      g.fillRoundedRect(0, 5, 115, 50, 6);

      // Cab body mid tone
      g.fillStyle(0xCC1111);
      g.fillRoundedRect(5, 10, 105, 40, 4);

      // Metallic sheen — lighter red highlight strip along center
      g.fillStyle(0xFF4444, 0.6);
      g.fillRect(10, 26, 95, 8);

      // Darker red bottom section
      g.fillStyle(0x990000);
      g.fillRect(5, 40, 105, 10);

      // Chrome bumper at front
      g.fillStyle(0xDDDDDD);
      g.fillRect(108, 10, 10, 40);
      g.fillStyle(0xFFFFFF, 0.5);
      g.fillRect(110, 12, 4, 36);
      g.fillStyle(0x999999);
      g.fillRect(108, 10, 2, 40);

      // Windshield (dark blue tinted rectangle)
      g.fillStyle(0x1a2a4a);
      g.fillRoundedRect(80, 14, 25, 32, 3);
      // Windshield glare
      g.fillStyle(0x4488CC, 0.4);
      g.fillRect(82, 16, 8, 28);

      // Side mirrors — protruding dark rectangles
      g.fillStyle(0x333333);
      g.fillRect(85, 1, 10, 6);
      g.fillRect(85, 53, 10, 6);
      // Mirror glass
      g.fillStyle(0x6688AA);
      g.fillRect(86, 2, 8, 4);
      g.fillRect(86, 54, 8, 4);

      // Exhaust stacks — two chrome circles on top of cab
      g.fillStyle(0xCCCCCC);
      g.fillCircle(70, 15, 4);
      g.fillCircle(70, 45, 4);
      g.fillStyle(0x888888);
      g.fillCircle(70, 15, 2);
      g.fillCircle(70, 45, 2);
      g.fillStyle(0xFFFFFF, 0.4);
      g.fillCircle(69, 14, 1);
      g.fillCircle(69, 44, 1);

      // Black wheels visible on sides
      g.fillStyle(0x111111);
      g.fillRect(20, 0, 18, 7);
      g.fillRect(20, 53, 18, 7);
      g.fillRect(55, 0, 18, 7);
      g.fillRect(55, 53, 18, 7);
      // Wheel rims
      g.fillStyle(0x555555);
      g.fillRect(24, 1, 10, 5);
      g.fillRect(24, 54, 10, 5);
      g.fillRect(59, 1, 10, 5);
      g.fillRect(59, 54, 10, 5);

      // Front headlights
      g.fillStyle(0xFFFF88);
      g.fillCircle(115, 16, 3);
      g.fillCircle(115, 44, 3);
      g.fillStyle(0xFFFFCC);
      g.fillCircle(115, 16, 1.5);
      g.fillCircle(115, 44, 1.5);

      // Rear of cab details — dark area
      g.fillStyle(0x440000);
      g.fillRect(0, 10, 6, 40);
      // Tail lights
      g.fillStyle(0xFF0000);
      g.fillCircle(2, 16, 2);
      g.fillCircle(2, 44, 2);

      // Door lines
      g.lineStyle(1, 0x660000, 0.8);
      g.strokeRect(40, 12, 35, 36);

      // Roof edge highlight
      g.fillStyle(0xFF6666, 0.3);
      g.fillRect(10, 10, 65, 2);
    });

    // =========================================================================
    // 2. TRAILER (100x50) — Silver/gray trailer
    // =========================================================================
    makeTexture('trailer', 100, 50, (g, w, h) => {
      // Shadow
      g.fillStyle(0x000000, 0.25);
      g.fillRoundedRect(3, 3, 97, 47, 3);

      // Main body — silver
      g.fillStyle(0xAAAAAA);
      g.fillRoundedRect(0, 3, 96, 44, 3);

      // Lighter top section
      g.fillStyle(0xCCCCCC);
      g.fillRect(4, 6, 88, 18);

      // Darker bottom section
      g.fillStyle(0x888888);
      g.fillRect(4, 26, 88, 18);

      // Panel lines — vertical
      g.lineStyle(1, 0x777777, 0.7);
      for (let x = 15; x < 90; x += 12) {
        g.lineBetween(x, 5, x, 45);
      }
      // Horizontal center panel line
      g.lineBetween(4, 25, 92, 25);

      // Rear of trailer
      g.fillStyle(0x999999);
      g.fillRect(0, 5, 5, 40);

      // Rear lights
      g.fillStyle(0xFF0000);
      g.fillCircle(2, 12, 3);
      g.fillCircle(2, 38, 3);
      g.fillStyle(0xFF4444, 0.6);
      g.fillCircle(2, 12, 1.5);
      g.fillCircle(2, 38, 1.5);

      // Rear reflectors (amber)
      g.fillStyle(0xFFAA00);
      g.fillRect(0, 20, 3, 4);
      g.fillRect(0, 28, 3, 4);

      // Wheels
      g.fillStyle(0x111111);
      g.fillRect(10, 0, 14, 5);
      g.fillRect(10, 45, 14, 5);
      g.fillRect(30, 0, 14, 5);
      g.fillRect(30, 45, 14, 5);
      // Wheel rims
      g.fillStyle(0x444444);
      g.fillRect(13, 1, 8, 3);
      g.fillRect(13, 46, 8, 3);
      g.fillRect(33, 1, 8, 3);
      g.fillRect(33, 46, 8, 3);

      // Front hitch area
      g.fillStyle(0x666666);
      g.fillRect(92, 20, 8, 10);
      g.fillStyle(0x555555);
      g.fillCircle(96, 25, 3);

      // Top edge highlight
      g.fillStyle(0xDDDDDD, 0.5);
      g.fillRect(4, 4, 88, 2);
    });

    // =========================================================================
    // 3-7. CARS — Helper function for sedans
    // =========================================================================
    const drawCar = (key, w, h, bodyColor, bodyHighlight, bodyDark, isSporty, isBoxy) => {
      makeTexture(key, w, h, (g) => {
        // Shadow
        g.fillStyle(0x000000, 0.25);
        g.fillRoundedRect(3, 3, w - 3, h - 3, isBoxy ? 3 : 5);

        // Main body
        g.fillStyle(bodyColor);
        g.fillRoundedRect(0, 4, w - 5, h - 8, isBoxy ? 3 : 5);

        // Body highlight (top half)
        g.fillStyle(bodyHighlight, 0.4);
        g.fillRect(5, 6, w - 15, Math.floor((h - 8) / 2) - 2);

        // Body dark shade (bottom half)
        g.fillStyle(bodyDark, 0.3);
        g.fillRect(5, Math.floor(h / 2), w - 15, Math.floor((h - 8) / 2) - 2);

        // Windshield
        const wsWidth = isSporty ? 14 : (isBoxy ? 20 : 16);
        g.fillStyle(0x223355);
        g.fillRoundedRect(w - 22, 8, wsWidth, h - 16, 2);
        // Windshield glare
        g.fillStyle(0x5588BB, 0.35);
        g.fillRect(w - 20, 10, 5, h - 20);

        // Rear window
        g.fillStyle(0x223355);
        g.fillRoundedRect(8, 10, 12, h - 20, 2);
        g.fillStyle(0x5588BB, 0.25);
        g.fillRect(9, 12, 4, h - 24);

        // Roof panel line
        g.lineStyle(1, bodyDark, 0.5);
        g.lineBetween(20, 8, w - 22, 8);
        g.lineBetween(20, h - 8, w - 22, h - 8);

        // Wheels
        g.fillStyle(0x111111);
        const wheelW = isBoxy ? 10 : 8;
        const wheelH = isBoxy ? 6 : 5;
        g.fillRect(8, 0, wheelW, wheelH);
        g.fillRect(8, h - wheelH, wheelW, wheelH);
        g.fillRect(w - 22, 0, wheelW, wheelH);
        g.fillRect(w - 22, h - wheelH, wheelW, wheelH);
        // Rims
        g.fillStyle(0x555555);
        g.fillRect(10, 1, wheelW - 4, wheelH - 2);
        g.fillRect(10, h - wheelH + 1, wheelW - 4, wheelH - 2);
        g.fillRect(w - 20, 1, wheelW - 4, wheelH - 2);
        g.fillRect(w - 20, h - wheelH + 1, wheelW - 4, wheelH - 2);

        // Headlights
        g.fillStyle(0xFFFF99);
        g.fillCircle(w - 7, 9, 2);
        g.fillCircle(w - 7, h - 9, 2);

        // Tail lights
        g.fillStyle(0xFF0000);
        g.fillCircle(3, 9, 2);
        g.fillCircle(3, h - 9, 2);

        // Front bumper
        g.fillStyle(0xBBBBBB);
        g.fillRect(w - 6, 6, 3, h - 12);

        // Door line
        g.lineStyle(1, bodyDark, 0.4);
        g.lineBetween(Math.floor(w / 2) - 5, 8, Math.floor(w / 2) - 5, h - 8);

        if (isSporty) {
          // Racing stripe
          g.fillStyle(0xFFFFFF, 0.3);
          g.fillRect(5, Math.floor(h / 2) - 1, w - 15, 2);
        }
      });
    };

    // 3. car_red
    drawCar('car_red', 60, 35, 0xCC2222, 0xFF4444, 0x881111, false, false);
    // 4. car_blue
    drawCar('car_blue', 60, 35, 0x2244AA, 0x4466CC, 0x112266, false, false);
    // 5. car_green
    drawCar('car_green', 60, 35, 0x228822, 0x44BB44, 0x115511, false, false);
    // 6. car_yellow (sporty)
    drawCar('car_yellow', 55, 30, 0xDDCC00, 0xFFEE44, 0xAA9900, true, false);
    // 7. car_white (boxy SUV)
    drawCar('car_white', 65, 40, 0xDDDDDD, 0xFFFFFF, 0xAAAAAA, false, true);

    // =========================================================================
    // 8. POLICE CAR (60x35)
    // =========================================================================
    makeTexture('police', 60, 35, (g) => {
      // Shadow
      g.fillStyle(0x000000, 0.25);
      g.fillRoundedRect(3, 3, 57, 32, 5);

      // Main body — black bottom
      g.fillStyle(0x111111);
      g.fillRoundedRect(0, 4, 55, 27, 5);

      // White upper section
      g.fillStyle(0xEEEEEE);
      g.fillRect(5, 6, 45, 12);

      // Black lower section (already the base)

      // Door stripe — white
      g.fillStyle(0xFFFFFF);
      g.fillRect(15, 20, 25, 4);

      // Windshield
      g.fillStyle(0x223355);
      g.fillRoundedRect(40, 8, 12, 19, 2);
      g.fillStyle(0x5588BB, 0.3);
      g.fillRect(41, 10, 4, 15);

      // Rear window
      g.fillStyle(0x223355);
      g.fillRoundedRect(8, 10, 10, 15, 2);

      // Light bar on top
      g.fillStyle(0x333333);
      g.fillRect(25, 11, 16, 13);
      // Red light
      g.fillStyle(0xFF0000);
      g.fillCircle(29, 14, 3);
      g.fillStyle(0xFF4444, 0.6);
      g.fillCircle(29, 14, 1.5);
      // Blue light
      g.fillStyle(0x0044FF);
      g.fillCircle(37, 14, 3);
      g.fillStyle(0x4488FF, 0.6);
      g.fillCircle(37, 14, 1.5);
      // Red light bottom
      g.fillStyle(0xFF0000);
      g.fillCircle(29, 21, 3);
      g.fillStyle(0xFF4444, 0.6);
      g.fillCircle(29, 21, 1.5);
      // Blue light bottom
      g.fillStyle(0x0044FF);
      g.fillCircle(37, 21, 3);
      g.fillStyle(0x4488FF, 0.6);
      g.fillCircle(37, 21, 1.5);

      // Wheels
      g.fillStyle(0x111111);
      g.fillRect(8, 0, 8, 5);
      g.fillRect(8, 30, 8, 5);
      g.fillRect(40, 0, 8, 5);
      g.fillRect(40, 30, 8, 5);
      g.fillStyle(0x444444);
      g.fillRect(10, 1, 4, 3);
      g.fillRect(10, 31, 4, 3);
      g.fillRect(42, 1, 4, 3);
      g.fillRect(42, 31, 4, 3);

      // Headlights
      g.fillStyle(0xFFFF99);
      g.fillCircle(53, 9, 2);
      g.fillCircle(53, 26, 2);

      // Tail lights
      g.fillStyle(0xFF0000);
      g.fillCircle(3, 9, 2);
      g.fillCircle(3, 26, 2);

      // Front bumper
      g.fillStyle(0xCCCCCC);
      g.fillRect(53, 7, 3, 21);

      // "POLICE" text area — simplified
      g.fillStyle(0xFFFFFF);
      g.fillRect(20, 25, 15, 3);
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
    // 14. FUEL CANISTER (25x25)
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

    // Helper RNG function used by buildings and road (defined inline for building usage)
    function rng(seed) {
      let s = seed;
      return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
    }
  }
}
