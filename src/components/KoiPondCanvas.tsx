import React, { useEffect, useRef, useState } from 'react';
import { waterAudio } from './WaterAudio';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  speed: number;
  opacity: number;
}

interface FoodPellet {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export type KoiPattern = 
  | 'kohaku' 
  | 'sanke' 
  | 'tancho' 
  | 'yamabuki' 
  | 'calico' 
  | 'asagi' 
  | 'emerald' 
  | 'midnight_gold';

// Multi-segment articulated spine kinematics for organic swimming
interface KoiConfig {
  size: number;
  baseColor: string;
  patternType: KoiPattern;
  tailLength: number;
  finSpread: number;
  maxSpeed: number;
}

class KoiEntity {
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;
  heading: number = 0;
  targetHeading: number = 0;
  swimCycle: number = 0;
  swimSpeed: number = 1.6;
  size: number;
  patternType: KoiPattern;
  
  // 14 spine joints
  numJoints: number = 14;
  jointDist: number = 10;
  jointsX: number[] = [];
  jointsY: number[] = [];
  jointAngles: number[] = [];
  
  // Pectoral fin flap phase
  pecFinPhase: number = 0;
  dorsalPhase: number = 0;
  
  targetX: number;
  targetY: number;
  targetChangeTimer: number = 0;
  depth: number; // 0 (deep) to 1 (near surface)

  constructor(x: number, y: number, config: KoiConfig, depth = 0.8) {
    this.x = x;
    this.y = y;
    this.size = config.size;
    this.patternType = config.patternType;
    this.jointDist = (this.size / 14) * 0.9;
    this.heading = Math.random() * Math.PI * 2;
    this.targetHeading = this.heading;
    this.depth = depth;

    this.targetX = x + Math.cos(this.heading) * 200;
    this.targetY = y + Math.sin(this.heading) * 200;

    for (let i = 0; i < this.numJoints; i++) {
      this.jointsX.push(this.x - Math.cos(this.heading) * (i * this.jointDist));
      this.jointsY.push(this.y - Math.sin(this.heading) * (i * this.jointDist));
      this.jointAngles.push(this.heading);
    }
    this.swimCycle = Math.random() * 100;
  }

  update(width: number, height: number, food: FoodPellet[], mouseX: number, mouseY: number, isMouseActive: boolean) {
    this.targetChangeTimer--;
    
    // Check if food is present
    let closestFoodDist = 9999;
    let closestFood: FoodPellet | null = null;
    if (food.length > 0) {
      for (const f of food) {
        const d = Math.hypot(f.x - this.x, f.y - this.y);
        if (d < closestFoodDist) {
          closestFoodDist = d;
          closestFood = f;
        }
      }
    }

    if (closestFood && closestFoodDist < 450) {
      this.targetX = closestFood.x;
      this.targetY = closestFood.y;
      this.swimSpeed = 2.4;
    } else if (isMouseActive && Math.hypot(mouseX - this.x, mouseY - this.y) < 140) {
      // Soft avoidance if mouse comes too close
      const avoidAngle = Math.atan2(this.y - mouseY, this.x - mouseX);
      this.targetHeading = avoidAngle + (Math.random() - 0.5) * 0.4;
      this.swimSpeed = 2.6;
    } else if (this.targetChangeTimer <= 0) {
      // Pick serene new target in pond
      const margin = 120;
      this.targetX = margin + Math.random() * (width - margin * 2);
      this.targetY = margin + Math.random() * (height - margin * 2);
      this.targetChangeTimer = 180 + Math.random() * 240;
      this.swimSpeed = 1.3 + Math.random() * 0.7;
    }

    // Turn toward target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.targetHeading = Math.atan2(dy, dx);

    // Smooth heading interpolation (natural turning radius)
    let angleDiff = this.targetHeading - this.heading;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    this.heading += angleDiff * 0.035;

    // Movement velocity
    this.vx = Math.cos(this.heading) * this.swimSpeed;
    this.vy = Math.sin(this.heading) * this.swimSpeed;
    this.x += this.vx;
    this.y += this.vy;

    // Boundary wrapping / bouncing
    const pad = 80;
    if (this.x < -pad) this.x = width + pad;
    if (this.x > width + pad) this.x = -pad;
    if (this.y < -pad) this.y = height + pad;
    if (this.y > height + pad) this.y = -pad;

    // Sinusoidal body oscillation for swimming
    this.swimCycle += this.swimSpeed * 0.07;
    this.pecFinPhase += this.swimSpeed * 0.08;
    this.dorsalPhase += this.swimSpeed * 0.06;

    // Head is joint 0
    this.jointsX[0] = this.x;
    this.jointsY[0] = this.y;
    this.jointAngles[0] = this.heading;

    // Articulated inverse kinematics along spine with sinusoidal tail propagation
    for (let i = 1; i < this.numJoints; i++) {
      const prevX = this.jointsX[i - 1];
      const prevY = this.jointsY[i - 1];

      // Lateral spine oscillation increases toward tail
      const tailOscillation = Math.sin(this.swimCycle - i * 0.42) * (i * 0.16) * (this.swimSpeed * 0.55);
      
      const angle = Math.atan2(this.jointsY[i] - prevY, this.jointsX[i] - prevX);
      const targetAngle = angle + tailOscillation * 0.06;
      
      this.jointsX[i] = prevX + Math.cos(targetAngle) * this.jointDist;
      this.jointsY[i] = prevY + Math.sin(targetAngle) * this.jointDist;
      this.jointAngles[i] = targetAngle;
    }
  }

  draw(ctx: CanvasRenderingContext2D, baseOpacity = 0.85) {
    const scale = this.size / 150;
    const finalAlpha = baseOpacity * this.depth;

    ctx.save();
    ctx.globalAlpha = finalAlpha;

    // 1. Draw Submerged Soft Shadow on pond floor
    ctx.save();
    ctx.translate(22 * this.depth, 28 * this.depth);
    this.drawFishBodyAndFins(ctx, scale, true);
    ctx.restore();

    // 2. Draw Fish Body, Fins, Scales, Whiskers
    this.drawFishBodyAndFins(ctx, scale, false);

    ctx.restore();
  }

  getFinColors(): { start: string; mid: string; edge: string; rays: string } {
    if (this.patternType === 'calico') {
      return {
        start: 'rgba(255, 95, 50, 0.95)',
        mid: 'rgba(0, 230, 210, 0.85)',
        edge: 'rgba(255, 215, 80, 0.5)',
        rays: 'rgba(255, 255, 255, 0.5)'
      };
    }
    if (this.patternType === 'asagi') {
      return {
        start: 'rgba(235, 45, 30, 0.95)',
        mid: 'rgba(255, 120, 80, 0.75)',
        edge: 'rgba(255, 245, 240, 0.4)',
        rays: 'rgba(255, 255, 255, 0.5)'
      };
    }
    if (this.patternType === 'emerald') {
      return {
        start: 'rgba(16, 185, 129, 0.92)',
        mid: 'rgba(52, 211, 153, 0.75)',
        edge: 'rgba(254, 240, 138, 0.45)',
        rays: 'rgba(255, 255, 210, 0.5)'
      };
    }
    if (this.patternType === 'midnight_gold') {
      return {
        start: 'rgba(28, 22, 38, 0.95)',
        mid: 'rgba(217, 119, 6, 0.85)',
        edge: 'rgba(250, 204, 21, 0.55)',
        rays: 'rgba(255, 235, 150, 0.65)'
      };
    }
    if (this.patternType === 'yamabuki') {
      return {
        start: 'rgba(245, 158, 11, 0.95)',
        mid: 'rgba(251, 191, 36, 0.8)',
        edge: 'rgba(254, 240, 138, 0.4)',
        rays: 'rgba(255, 255, 255, 0.5)'
      };
    }
    return {
      start: 'rgba(235, 75, 40, 0.95)',
      mid: 'rgba(255, 140, 80, 0.7)',
      edge: 'rgba(255, 230, 210, 0.35)',
      rays: 'rgba(255, 255, 255, 0.4)'
    };
  }

  private drawFishBodyAndFins(ctx: CanvasRenderingContext2D, scale: number, isShadow: boolean) {
    const finColors = this.getFinColors();
    const bodyWidths = [
      14, 20, 24, 26, 25, 23, 20, 17, 14, 11, 8, 6, 4, 3
    ].map(w => w * scale);

    // Left and Right body outline coordinates
    const leftCoords: { x: number; y: number }[] = [];
    const rightCoords: { x: number; y: number }[] = [];

    for (let i = 0; i < this.numJoints; i++) {
      const jx = this.jointsX[i];
      const jy = this.jointsY[i];
      const angle = this.jointAngles[i];
      const w = bodyWidths[i];

      const perpAngle = angle + Math.PI / 2;
      leftCoords.push({
        x: jx + Math.cos(perpAngle) * w,
        y: jy + Math.sin(perpAngle) * w
      });
      rightCoords.push({
        x: jx - Math.cos(perpAngle) * w,
        y: jy - Math.sin(perpAngle) * w
      });
    }

    if (isShadow) {
      // Subtle blurred dark shadow
      ctx.fillStyle = 'rgba(15, 2, 5, 0.45)';
      ctx.beginPath();
      ctx.moveTo(leftCoords[0].x, leftCoords[0].y);
      for (let i = 1; i < leftCoords.length; i++) {
        ctx.lineTo(leftCoords[i].x, leftCoords[i].y);
      }
      for (let i = rightCoords.length - 1; i >= 0; i--) {
        ctx.lineTo(rightCoords[i].x, rightCoords[i].y);
      }
      ctx.closePath();
      ctx.fill();
      return;
    }

    // A. Grand Billowing Caudal (Tail) Fin (Matches Reference Image 2)
    const tailIndex = this.numJoints - 1;
    const tailX = this.jointsX[tailIndex];
    const tailY = this.jointsY[tailIndex];
    const tailAngle = this.jointAngles[tailIndex];
    const tailSpread = 42 * scale;
    const tailLength = 65 * scale;
    const tailWave = Math.sin(this.swimCycle - 6) * 14 * scale;

    ctx.save();
    ctx.translate(tailX, tailY);
    ctx.rotate(tailAngle + Math.PI);

    // Caudal fin gradient with dynamic multi-color support
    const finGrad = ctx.createRadialGradient(0, 0, 5, tailLength * 0.8, 0, tailLength * 1.2);
    finGrad.addColorStop(0, finColors.start);
    finGrad.addColorStop(0.35, finColors.mid);
    finGrad.addColorStop(0.7, finColors.edge);
    finGrad.addColorStop(1, 'rgba(255, 255, 255, 0.15)');

    ctx.fillStyle = finGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // Double fluked fan tail
    ctx.bezierCurveTo(
      tailLength * 0.4, -tailSpread * 0.9 + tailWave,
      tailLength * 0.8, -tailSpread * 1.3 - tailWave * 0.5,
      tailLength * 1.2, -tailSpread * 0.4
    );
    ctx.quadraticCurveTo(tailLength * 0.9, 0, tailLength * 1.2, tailSpread * 0.4);
    ctx.bezierCurveTo(
      tailLength * 0.8, tailSpread * 1.3 + tailWave * 0.5,
      tailLength * 0.4, tailSpread * 0.9 - tailWave,
      0, 0
    );
    ctx.closePath();
    ctx.fill();

    // Striations / fin rays
    ctx.strokeStyle = finColors.rays;
    ctx.lineWidth = 1;
    for (let r = -4; r <= 4; r++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(tailLength * 0.5, (r * tailSpread) * 0.2 + tailWave * 0.5, tailLength * 1.05, (r * tailSpread) * 0.28);
      ctx.stroke();
    }
    ctx.restore();

    // B. Pectoral Fins (Left & Right - flapping smoothly like silk)
    const pecJoint = 3;
    const pecX = this.jointsX[pecJoint];
    const pecY = this.jointsY[pecJoint];
    const pecAngle = this.jointAngles[pecJoint];
    const pecFlap = Math.sin(this.pecFinPhase) * 0.35;

    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(pecX, pecY);
      ctx.rotate(pecAngle + (side * Math.PI * 0.45) + (side * pecFlap));

      const pecLength = 52 * scale;
      const pecWidth = 32 * scale;

      const pGrad = ctx.createLinearGradient(0, 0, pecLength, side * pecWidth);
      pGrad.addColorStop(0, finColors.start);
      pGrad.addColorStop(0.4, finColors.mid);
      pGrad.addColorStop(0.8, finColors.edge);
      pGrad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        pecLength * 0.4, side * pecWidth * 0.3,
        pecLength * 0.9, side * pecWidth * 1.1,
        pecLength, side * pecWidth * 0.4
      );
      ctx.quadraticCurveTo(pecLength * 0.6, 0, 0, 0);
      ctx.closePath();
      ctx.fill();

      // Delicate ray lines
      ctx.strokeStyle = finColors.rays;
      ctx.lineWidth = 0.8;
      for (let k = 1; k <= 4; k++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(pecLength * (0.6 + k * 0.09), side * pecWidth * (k * 0.22));
        ctx.stroke();
      }
      ctx.restore();
    }

    // C. Pelvic/Ventral Fins (near joint 7)
    const pelJoint = 7;
    const pelX = this.jointsX[pelJoint];
    const pelY = this.jointsY[pelJoint];
    const pelAngle = this.jointAngles[pelJoint];

    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(pelX, pelY);
      ctx.rotate(pelAngle + (side * Math.PI * 0.65));
      const pelL = 28 * scale;
      const pelW = 14 * scale;

      ctx.fillStyle = finColors.mid;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(pelL * 0.7, side * pelW, pelL, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // D. Main Body (Smooth Bezier contour)
    ctx.beginPath();
    // Head snout
    const headX = this.jointsX[0];
    const headY = this.jointsY[0];
    const headAngle = this.jointAngles[0];
    const noseX = headX + Math.cos(headAngle) * (20 * scale);
    const noseY = headY + Math.sin(headAngle) * (20 * scale);

    ctx.moveTo(noseX, noseY);
    // Left side
    for (let i = 0; i < leftCoords.length; i++) {
      ctx.lineTo(leftCoords[i].x, leftCoords[i].y);
    }
    // Tail tip
    ctx.lineTo(this.jointsX[tailIndex], this.jointsY[tailIndex]);
    // Right side
    for (let i = rightCoords.length - 1; i >= 0; i--) {
      ctx.lineTo(rightCoords[i].x, rightCoords[i].y);
    }
    ctx.closePath();

    // Body Base Gradient (Adapts to pattern: Calico, Asagi, Emerald, Midnight Gold, Yamabuki, Kohaku)
    const bodyGrad = ctx.createLinearGradient(
      leftCoords[3].x, leftCoords[3].y,
      rightCoords[3].x, rightCoords[3].y
    );
    if (this.patternType === 'asagi') {
      bodyGrad.addColorStop(0, 'rgba(30, 75, 120, 0.95)');
      bodyGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.98)');
      bodyGrad.addColorStop(1, 'rgba(25, 65, 105, 0.95)');
    } else if (this.patternType === 'emerald') {
      bodyGrad.addColorStop(0, 'rgba(4, 120, 87, 0.95)');
      bodyGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.98)');
      bodyGrad.addColorStop(1, 'rgba(5, 150, 105, 0.95)');
    } else if (this.patternType === 'midnight_gold') {
      bodyGrad.addColorStop(0, 'rgba(18, 14, 26, 0.98)');
      bodyGrad.addColorStop(0.5, 'rgba(34, 26, 50, 1.0)');
      bodyGrad.addColorStop(1, 'rgba(14, 10, 22, 0.98)');
    } else if (this.patternType === 'yamabuki') {
      bodyGrad.addColorStop(0, 'rgba(245, 158, 11, 0.95)');
      bodyGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.98)');
      bodyGrad.addColorStop(1, 'rgba(217, 119, 6, 0.95)');
    } else if (this.patternType === 'calico') {
      bodyGrad.addColorStop(0, 'rgba(255, 245, 240, 0.98)');
      bodyGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
      bodyGrad.addColorStop(1, 'rgba(240, 250, 255, 0.95)');
    } else {
      bodyGrad.addColorStop(0, 'rgba(250, 240, 235, 0.95)');
      bodyGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
      bodyGrad.addColorStop(1, 'rgba(240, 225, 220, 0.92)');
    }
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // E. Realistic Multi-Color & Authentic Koi Markings
    ctx.save();
    // Clip inside the fish body so markings conform naturally to skin
    ctx.clip();

    // Vivid red/orange Kohaku islands
    const markingColors = [
      'rgba(225, 45, 20, 0.95)',
      'rgba(245, 95, 30, 0.9)',
      'rgba(210, 30, 15, 0.95)'
    ];

    if (this.patternType === 'calico') {
      // 1. Turquoise / electric cyan spots
      ctx.fillStyle = 'rgba(0, 235, 215, 0.92)';
      ctx.beginPath();
      ctx.ellipse(this.jointsX[1], this.jointsY[1], 15 * scale, 11 * scale, this.jointAngles[1], 0, Math.PI * 2);
      ctx.ellipse(this.jointsX[5] + 5 * scale, this.jointsY[5] + 4 * scale, 17 * scale, 12 * scale, this.jointAngles[5] + 0.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Hot coral / scarlet patches
      ctx.fillStyle = 'rgba(255, 60, 30, 0.95)';
      ctx.beginPath();
      ctx.ellipse(this.jointsX[3] - 4 * scale, this.jointsY[3] - 3 * scale, 22 * scale, 15 * scale, this.jointAngles[3] - 0.2, 0, Math.PI * 2);
      ctx.ellipse(this.jointsX[8], this.jointsY[8], 14 * scale, 9 * scale, this.jointAngles[8], 0, Math.PI * 2);
      ctx.fill();

      // 3. Sunny gold Kinrin flecks
      ctx.fillStyle = 'rgba(255, 215, 0, 0.85)';
      for (let s = 2; s <= 7; s += 2) {
        ctx.beginPath();
        ctx.arc(this.jointsX[s] + 6 * scale, this.jointsY[s] - 4 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Inky velvet black sumi spots
      ctx.fillStyle = 'rgba(18, 16, 26, 0.92)';
      ctx.beginPath();
      ctx.ellipse(this.jointsX[4] + 8 * scale, this.jointsY[4] + 2 * scale, 8 * scale, 6 * scale, 0.5, 0, Math.PI * 2);
      ctx.ellipse(this.jointsX[7] - 6 * scale, this.jointsY[7] - 2 * scale, 7 * scale, 5 * scale, -0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.patternType === 'asagi') {
      // Flame scarlet lateral belly & cheeks
      ctx.fillStyle = 'rgba(235, 60, 30, 0.92)';
      ctx.beginPath();
      ctx.ellipse(this.jointsX[2], this.jointsY[2] + 9 * scale, 16 * scale, 8 * scale, this.jointAngles[2], 0, Math.PI * 2);
      ctx.ellipse(this.jointsX[2], this.jointsY[2] - 9 * scale, 16 * scale, 8 * scale, this.jointAngles[2], 0, Math.PI * 2);
      ctx.ellipse(this.jointsX[6], this.jointsY[6] + 7 * scale, 14 * scale, 6 * scale, this.jointAngles[6], 0, Math.PI * 2);
      ctx.fill();

      // Azure diamond scale flecks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let s = 1; s <= 8; s++) {
        ctx.beginPath();
        ctx.arc(this.jointsX[s], this.jointsY[s], 2.5 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.patternType === 'emerald') {
      // Jade mint highlights & gold scale flecks
      ctx.fillStyle = 'rgba(167, 243, 208, 0.85)';
      ctx.beginPath();
      ctx.ellipse(this.jointsX[2], this.jointsY[2], 18 * scale, 12 * scale, this.jointAngles[2], 0, Math.PI * 2);
      ctx.ellipse(this.jointsX[6], this.jointsY[6], 15 * scale, 10 * scale, this.jointAngles[6], 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 220, 100, 0.8)';
      for (let s = 2; s <= 8; s += 2) {
        ctx.beginPath();
        ctx.arc(this.jointsX[s], this.jointsY[s] + 3 * scale, 3.5 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.patternType === 'midnight_gold') {
      // Luminous 24K gold sunburst patches on velvet obsidian
      ctx.fillStyle = 'rgba(250, 204, 21, 0.92)';
      ctx.beginPath();
      ctx.ellipse(this.jointsX[1], this.jointsY[1], 14 * scale, 10 * scale, this.jointAngles[1], 0, Math.PI * 2);
      ctx.ellipse(this.jointsX[4], this.jointsY[4], 22 * scale, 14 * scale, this.jointAngles[4], 0, Math.PI * 2);
      ctx.ellipse(this.jointsX[8], this.jointsY[8], 15 * scale, 9 * scale, this.jointAngles[8], 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
      ctx.beginPath();
      ctx.arc(this.jointsX[4], this.jointsY[4], 8 * scale, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.patternType === 'kohaku' || this.patternType === 'sanke') {
      // Head patch (Menkaburi / Tancho / Inazuma pattern)
      ctx.fillStyle = markingColors[0];
      ctx.beginPath();
      ctx.ellipse(
        this.jointsX[1], this.jointsY[1],
        16 * scale, 12 * scale,
        this.jointAngles[1], 0, Math.PI * 2
      );
      ctx.fill();

      // Shoulder / Mid-body large stepped pattern (Nidan / Sandan)
      ctx.fillStyle = markingColors[1];
      ctx.beginPath();
      ctx.ellipse(
        this.jointsX[3] + 4 * scale, this.jointsY[3],
        22 * scale, 16 * scale,
        this.jointAngles[3] + 0.1, 0, Math.PI * 2
      );
      ctx.fill();

      ctx.fillStyle = markingColors[2];
      ctx.beginPath();
      ctx.ellipse(
        this.jointsX[6] - 3 * scale, this.jointsY[6],
        20 * scale, 13 * scale,
        this.jointAngles[6] - 0.15, 0, Math.PI * 2
      );
      ctx.fill();

      // Tail root patch (Odome)
      ctx.fillStyle = markingColors[0];
      ctx.beginPath();
      ctx.ellipse(
        this.jointsX[9], this.jointsY[9],
        13 * scale, 8 * scale,
        this.jointAngles[9], 0, Math.PI * 2
      );
      ctx.fill();

      // Gold shimmer flecks (Kinrin scales)
      ctx.fillStyle = 'rgba(255, 215, 0, 0.65)';
      for (let s = 2; s <= 8; s += 2) {
        ctx.beginPath();
        ctx.arc(this.jointsX[s] + (Math.sin(s) * 4 * scale), this.jointsY[s], 3.5 * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      if (this.patternType === 'sanke') {
        // Black sumi inky spots
        ctx.fillStyle = 'rgba(20, 20, 25, 0.88)';
        ctx.beginPath();
        ctx.ellipse(this.jointsX[4] - 7 * scale, this.jointsY[4] + 3 * scale, 7 * scale, 5 * scale, 0.4, 0, Math.PI * 2);
        ctx.ellipse(this.jointsX[8] + 5 * scale, this.jointsY[8] - 2 * scale, 6 * scale, 4 * scale, -0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.patternType === 'tancho') {
      // Perfect sacred round red crown on the head
      ctx.fillStyle = 'rgba(220, 25, 20, 0.98)';
      ctx.beginPath();
      ctx.arc(this.jointsX[1], this.jointsY[1], 13 * scale, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.patternType === 'yamabuki') {
      // Golden yellow radiant koi
      ctx.fillStyle = 'rgba(245, 185, 30, 0.85)';
      ctx.beginPath();
      ctx.ellipse(this.jointsX[3], this.jointsY[3], 24 * scale, 15 * scale, this.jointAngles[3], 0, Math.PI * 2);
      ctx.ellipse(this.jointsX[7], this.jointsY[7], 18 * scale, 11 * scale, this.jointAngles[7], 0, Math.PI * 2);
      ctx.fill();
    }

    // 3D Dorsal highlight ridge (specular spine glow)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2.5 * scale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.jointsX[1], this.jointsY[1]);
    for (let i = 2; i <= 9; i++) {
      ctx.lineTo(this.jointsX[i], this.jointsY[i]);
    }
    ctx.stroke();

    ctx.restore(); // end clip

    // F. Dorsal Fin along the spine (translucent undulating ridge)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 240, 230, 0.7)';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(this.jointsX[4], this.jointsY[4]);
    for (let i = 5; i <= 9; i++) {
      const dorsalWave = Math.sin(this.dorsalPhase - i * 0.5) * 2 * scale;
      ctx.lineTo(this.jointsX[i] + dorsalWave, this.jointsY[i]);
    }
    ctx.stroke();
    ctx.restore();

    // G. Eyes & Barbels (Whiskers)
    const eyeOffsetX = 8 * scale;
    const eyeOffsetY = 11 * scale;
    for (const side of [-1, 1]) {
      const eyeX = headX + Math.cos(headAngle) * eyeOffsetX + Math.cos(headAngle + Math.PI / 2) * (side * eyeOffsetY);
      const eyeY = headY + Math.sin(headAngle) * eyeOffsetX + Math.sin(headAngle + Math.PI / 2) * (side * eyeOffsetY);

      // Eye socket / iris
      ctx.fillStyle = '#110507';
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 2.8 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Shiny catchlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(eyeX - 0.7 * scale, eyeY - 0.7 * scale, 1.1 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Long graceful barbel (whisker)
      ctx.strokeStyle = 'rgba(255, 230, 210, 0.75)';
      ctx.lineWidth = 1.0 * scale;
      ctx.beginPath();
      ctx.moveTo(noseX, noseY);
      const barbelX = noseX + Math.cos(headAngle + side * 0.9) * (18 * scale);
      const barbelY = noseY + Math.sin(headAngle + side * 0.9) * (18 * scale);
      ctx.quadraticCurveTo(
        noseX + Math.cos(headAngle + side * 0.4) * (12 * scale),
        noseY + Math.sin(headAngle + side * 0.4) * (12 * scale),
        barbelX, barbelY
      );
      ctx.stroke();
    }
  }
}

interface KoiPondCanvasProps {
  opacity?: number;
  interactive?: boolean;
}

export const KoiPondCanvas: React.FC<KoiPondCanvasProps> = ({ opacity = 0.95, interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [transparency, setTransparency] = useState<number>(opacity);
  const [fishCount, setFishCount] = useState<number>(3);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [causticPhase, setCausticPhase] = useState<number>(0);

  const ripplesRef = useRef<Ripple[]>([]);
  const foodRef = useRef<FoodPellet[]>([]);
  const koiRef = useRef<KoiEntity[]>([]);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean; lastX: number; lastY: number }>({
    x: 0,
    y: 0,
    active: false,
    lastX: 0,
    lastY: 0
  });

  // Initialize Koi fish pond
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Koi 1: Grand Leader Kohaku (majestic scarlet hi on snow ivory)
    const koi1 = new KoiEntity(w * 0.45, h * 0.35, {
      size: 195,
      baseColor: '#ffffff',
      patternType: 'kohaku',
      tailLength: 75,
      finSpread: 50,
      maxSpeed: 2.2
    }, 0.95);

    // Koi 2: Vibrant Multi-Color Calico (Turquoise cyan, coral red, sunny gold, sumi black)
    const koi2 = new KoiEntity(w * 0.3, h * 0.6, {
      size: 175,
      baseColor: '#ffffff',
      patternType: 'calico',
      tailLength: 68,
      finSpread: 46,
      maxSpeed: 2.3
    }, 0.9);

    // Koi 3: Celestial Asagi Azure (Electric cyan & indigo spine with flame scarlet fins)
    const koi3 = new KoiEntity(w * 0.65, h * 0.4, {
      size: 165,
      baseColor: '#ffffff',
      patternType: 'asagi',
      tailLength: 62,
      finSpread: 44,
      maxSpeed: 2.1
    }, 0.88);

    // Koi 4: Golden Yamabuki (radiant 24K gold with metallic sheen)
    const koi4 = new KoiEntity(w * 0.55, h * 0.8, {
      size: 155,
      baseColor: '#ffffff',
      patternType: 'yamabuki',
      tailLength: 56,
      finSpread: 40,
      maxSpeed: 1.9
    }, 0.82);

    // Koi 5: Imperial Emerald Midori (shimmering jade green with gold scales)
    const koi5 = new KoiEntity(w * 0.78, h * 0.68, {
      size: 150,
      baseColor: '#ffffff',
      patternType: 'emerald',
      tailLength: 54,
      finSpread: 38,
      maxSpeed: 2.0
    }, 0.85);

    // Koi 6: Sacred Tancho (pure snow white with sacred vermilion crown)
    const koi6 = new KoiEntity(w * 0.22, h * 0.75, {
      size: 145,
      baseColor: '#ffffff',
      patternType: 'tancho',
      tailLength: 52,
      finSpread: 36,
      maxSpeed: 2.0
    }, 0.8);

    // Koi 7: Sanke Tri-Color (scarlet hi, inky sumi, and pearl white)
    const koi7 = new KoiEntity(w * 0.82, h * 0.3, {
      size: 160,
      baseColor: '#ffffff',
      patternType: 'sanke',
      tailLength: 60,
      finSpread: 42,
      maxSpeed: 2.1
    }, 0.9);

    // Koi 8: Midnight Gold Shiro (velvet obsidian black with 24K sunburst markings)
    const koi8 = new KoiEntity(w * 0.4, h * 0.85, {
      size: 140,
      baseColor: '#ffffff',
      patternType: 'midnight_gold',
      tailLength: 50,
      finSpread: 35,
      maxSpeed: 1.8
    }, 0.75);

    koiRef.current = [koi1, koi2, koi3, koi4, koi5, koi6, koi7, koi8];
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleFeedEvent = (e: any) => {
      const x = e.detail?.x || window.innerWidth / 2;
      const y = e.detail?.y || window.innerHeight / 2;
      for (let i = 0; i < 4; i++) {
        foodRef.current.push({
          x: x + (Math.random() - 0.5) * 50,
          y: y + (Math.random() - 0.5) * 50,
          radius: 3.5,
          alpha: 0.95
        });
      }
      ripplesRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: 110,
        strength: 0.7,
        speed: 2.0,
        opacity: 0.75
      });
    };

    window.addEventListener('koi-feed', handleFeedEvent);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('koi-feed', handleFeedEvent);
    };
  }, []);

  // Main Render Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;

      // Read active Motion Theme, Ambient Color Theme, Ripple Intensity, and Fish Count
      const motionTheme: string = (typeof window !== 'undefined' && (window as any).__MOTION_THEME__) || 'pond';
      const pondTheme: string = (typeof window !== 'undefined' && (window as any).__POND_COLOR_THEME__) || 'crimson';
      const customHue: number = (typeof window !== 'undefined' && (window as any).__POND_CUSTOM_HUE__) ?? -1;
      const rippleIntensity: number = (typeof window !== 'undefined' && (window as any).__RIPPLE_INTENSITY__) ?? 1.0;
      const activeFishCount: number = (typeof window !== 'undefined' && (window as any).__KOI_COUNT__) ?? 4;
      const activeOpacity: number = (typeof window !== 'undefined' && (window as any).__KOI_OPACITY__) ?? transparency;

      // 1. Draw Liquid Motion Background based on active Theme / Ambient Color
      const bgGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.4, 80,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.85
      );

      if (motionTheme === 'cyber') {
        bgGrad.addColorStop(0, '#150a30'); // Electric purple core
        bgGrad.addColorStop(0.4, '#0d0620'); // Deep cyber indigo
        bgGrad.addColorStop(0.75, '#060212'); // Dark space
        bgGrad.addColorStop(1, '#020106'); // Void
      } else if (motionTheme === 'aurora') {
        bgGrad.addColorStop(0, '#042824'); // Emerald cyan lagoon
        bgGrad.addColorStop(0.4, '#071d2c'); // Deep teal aurora
        bgGrad.addColorStop(0.75, '#0b0c26'); // Cosmic indigo
        bgGrad.addColorStop(1, '#04040e'); // Deep space
      } else if (motionTheme === 'gold') {
        bgGrad.addColorStop(0, '#2e1c05'); // Warm 24K solar core
        bgGrad.addColorStop(0.4, '#1c1003'); // Rich bronze amber
        bgGrad.addColorStop(0.75, '#100902'); // Deep obsidian
        bgGrad.addColorStop(1, '#050301'); // Noir
      } else {
        // Pond Mode: Respects selected Ambient Color Theme or Custom Spectrum Hue
        if (customHue >= 0) {
          bgGrad.addColorStop(0, `hsl(${customHue}, 80%, 15%)`);
          bgGrad.addColorStop(0.4, `hsl(${customHue}, 75%, 9%)`);
          bgGrad.addColorStop(0.75, `hsl(${customHue}, 70%, 5%)`);
          bgGrad.addColorStop(1, `hsl(${customHue}, 50%, 2%)`);
        } else if (pondTheme === 'cyan') {
          bgGrad.addColorStop(0, '#083244'); // Cyan lagoon core
          bgGrad.addColorStop(0.4, '#04202d');
          bgGrad.addColorStop(0.75, '#02141d');
          bgGrad.addColorStop(1, '#010a0e');
        } else if (pondTheme === 'emerald') {
          bgGrad.addColorStop(0, '#083824'); // Emerald jade core
          bgGrad.addColorStop(0.4, '#042517');
          bgGrad.addColorStop(0.75, '#02180e');
          bgGrad.addColorStop(1, '#010b06');
        } else if (pondTheme === 'violet') {
          bgGrad.addColorStop(0, '#280a3c'); // Midnight amethyst core
          bgGrad.addColorStop(0.4, '#180426');
          bgGrad.addColorStop(0.75, '#0e0216');
          bgGrad.addColorStop(1, '#050109');
        } else if (pondTheme === 'amber') {
          bgGrad.addColorStop(0, '#382005'); // Solar gold amber core
          bgGrad.addColorStop(0.4, '#241403');
          bgGrad.addColorStop(0.75, '#150b01');
          bgGrad.addColorStop(1, '#080400');
        } else if (pondTheme === 'obsidian') {
          bgGrad.addColorStop(0, '#1e1e24'); // Charcoal noir core
          bgGrad.addColorStop(0.4, '#141418');
          bgGrad.addColorStop(0.75, '#0c0c0e');
          bgGrad.addColorStop(1, '#050506');
        } else {
          // Default: Liquid Crimson Zen Pond
          bgGrad.addColorStop(0, '#420811'); // Glowing ruby center
          bgGrad.addColorStop(0.4, '#2c040b'); // Deep crimson
          bgGrad.addColorStop(0.75, '#1b0206'); // Wine burgundy
          bgGrad.addColorStop(1, '#0e0103'); // Dark depth
        }
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Motionsites.ai Inspired Kinetic Wave Caustics & Grid
      const cPhase = time * 0.0006;
      ctx.save();

      if (motionTheme === 'cyber') {
        // Cybernetic perspective grid and neon pulse lines
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.14)';
        ctx.lineWidth = 1.0;
        const horizon = height * 0.45;
        // Perspective rays
        for (let i = -10; i <= 20; i++) {
          const startX = width * 0.5 + i * 80;
          ctx.beginPath();
          ctx.moveTo(width * 0.5, horizon);
          ctx.lineTo(startX * 1.8 - width * 0.4, height);
          ctx.stroke();
        }
        // Flowing horizontal scan lines
        const scanOffset = (time * 0.06) % 50;
        ctx.strokeStyle = 'rgba(255, 0, 128, 0.12)';
        for (let y = horizon; y < height; y += 30) {
          const dy = y + scanOffset * ((y - horizon) / (height - horizon));
          if (dy < height) {
            ctx.beginPath();
            ctx.moveTo(0, dy);
            ctx.lineTo(width, dy);
            ctx.stroke();
          }
        }
      } else if (motionTheme === 'aurora') {
        // Ethereal chromatic aurora waves
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.strokeStyle = i === 0 ? 'rgba(0, 255, 170, 0.4)' : i === 1 ? 'rgba(0, 210, 255, 0.35)' : 'rgba(180, 0, 255, 0.3)';
          ctx.lineWidth = 2.5;
          for (let x = 0; x <= width; x += 40) {
            const y = (height * 0.3) + Math.sin(x * 0.005 + cPhase * 1.5 + i) * 60 + Math.cos(x * 0.008 - cPhase) * 40;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (motionTheme === 'gold') {
        // Solar luxury ray caustics & golden embers
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = 'rgba(255, 220, 110, 0.45)';
        ctx.lineWidth = 1.6;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 50) {
            const y = (height * 0.22 * i) + Math.sin(x * 0.007 + cPhase + i) * 40 + Math.cos(x * 0.01 - cPhase) * 25;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else {
        // Water caustics tinted by active color theme
        ctx.globalAlpha = 0.08;
        if (customHue >= 0) {
          ctx.strokeStyle = `hsla(${customHue}, 80%, 75%, 0.4)`;
        } else if (pondTheme === 'cyan') {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
        } else if (pondTheme === 'emerald') {
          ctx.strokeStyle = 'rgba(50, 255, 170, 0.35)';
        } else if (pondTheme === 'violet') {
          ctx.strokeStyle = 'rgba(220, 120, 255, 0.35)';
        } else if (pondTheme === 'amber') {
          ctx.strokeStyle = 'rgba(255, 215, 80, 0.4)';
        } else if (pondTheme === 'obsidian') {
          ctx.strokeStyle = 'rgba(200, 215, 235, 0.3)';
        } else {
          ctx.strokeStyle = 'rgba(255, 180, 160, 0.4)';
        }

        ctx.lineWidth = 1.2;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 60) {
            const y = (height * 0.25 * i) + Math.sin(x * 0.008 + cPhase + i) * 35 + Math.cos(x * 0.012 - cPhase) * 20;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3. Update & Draw Food Pellets
      for (let i = foodRef.current.length - 1; i >= 0; i--) {
        const f = foodRef.current[i];
        f.alpha -= 0.0015;
        f.radius = Math.max(1.5, f.radius * 0.999);

        ctx.save();
        ctx.fillStyle = `rgba(240, 190, 120, ${f.alpha})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Check if eaten by any koi
        for (const koi of koiRef.current) {
          if (Math.hypot(koi.x - f.x, koi.y - f.y) < koi.size * 0.2) {
            f.alpha = 0; // consumed!
            // trigger little eating ripple
            ripplesRef.current.push({
              x: f.x,
              y: f.y,
              radius: 4,
              maxRadius: 40 * (0.8 + 0.3 * rippleIntensity),
              strength: 0.6 * rippleIntensity,
              speed: 1.8 * (0.8 + 0.25 * rippleIntensity),
              opacity: 0.7
            });
            break;
          }
        }

        if (f.alpha <= 0) {
          foodRef.current.splice(i, 1);
        }
      }

      // 4. Update & Draw Koi Fish (Respects fishCount from controls)
      const currentFish = koiRef.current.slice(0, activeFishCount);
      currentFish.forEach((koi) => {
        koi.update(
          width,
          height,
          foodRef.current,
          mousePosRef.current.x,
          mousePosRef.current.y,
          mousePosRef.current.active
        );
        koi.draw(ctx, activeOpacity);
      });

      // 5. Update & Draw Subtle Water Ripples (Triggered by mouse / clicks / feeds)
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += r.speed;
        r.opacity = (1 - r.radius / r.maxRadius) * r.strength;

        if (r.radius >= r.maxRadius || r.opacity <= 0) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        // Inner and outer ripple rings with theme-aware neon/gold/rose color
        let rippleStroke: string;
        let secondaryStroke: string;

        if (motionTheme === 'cyber') {
          rippleStroke = `rgba(0, 245, 255, ${r.opacity * 0.85})`;
          secondaryStroke = `rgba(255, 0, 128, ${r.opacity * 0.5})`;
        } else if (motionTheme === 'aurora') {
          rippleStroke = `rgba(0, 255, 180, ${r.opacity * 0.8})`;
          secondaryStroke = `rgba(180, 0, 255, ${r.opacity * 0.5})`;
        } else if (motionTheme === 'gold') {
          rippleStroke = `rgba(255, 225, 120, ${r.opacity * 0.85})`;
          secondaryStroke = `rgba(255, 180, 60, ${r.opacity * 0.5})`;
        } else if (customHue >= 0) {
          rippleStroke = `hsla(${customHue}, 85%, 75%, ${r.opacity * 0.85})`;
          secondaryStroke = `hsla(${(customHue + 40) % 360}, 85%, 65%, ${r.opacity * 0.5})`;
        } else if (pondTheme === 'cyan') {
          rippleStroke = `rgba(0, 245, 255, ${r.opacity * 0.85})`;
          secondaryStroke = `rgba(0, 180, 255, ${r.opacity * 0.5})`;
        } else if (pondTheme === 'emerald') {
          rippleStroke = `rgba(0, 255, 180, ${r.opacity * 0.85})`;
          secondaryStroke = `rgba(16, 185, 129, ${r.opacity * 0.5})`;
        } else if (pondTheme === 'violet') {
          rippleStroke = `rgba(216, 130, 255, ${r.opacity * 0.85})`;
          secondaryStroke = `rgba(168, 85, 247, ${r.opacity * 0.5})`;
        } else if (pondTheme === 'amber') {
          rippleStroke = `rgba(255, 220, 100, ${r.opacity * 0.85})`;
          secondaryStroke = `rgba(245, 158, 11, ${r.opacity * 0.5})`;
        } else if (pondTheme === 'obsidian') {
          rippleStroke = `rgba(220, 230, 255, ${r.opacity * 0.75})`;
          secondaryStroke = `rgba(148, 163, 184, ${r.opacity * 0.45})`;
        } else {
          rippleStroke = `rgba(255, 230, 220, ${r.opacity * 0.65})`;
          secondaryStroke = `rgba(255, 190, 180, ${r.opacity * 0.35})`;
        }

        ctx.strokeStyle = rippleStroke;
        ctx.lineWidth = Math.max(1, 3 * (1 - r.radius / r.maxRadius));
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Subtle secondary inner echo ring
        if (r.radius > 16) {
          ctx.strokeStyle = secondaryStroke;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius - 12, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [fishCount, transparency]);

  // Mouse Move & Click Listeners for Ripples & Audio
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const prev = mousePosRef.current;
    const dist = Math.hypot(x - prev.lastX, y - prev.lastY);

    mousePosRef.current = {
      x,
      y,
      active: true,
      lastX: x,
      lastY: y
    };

    // Spawn subtle ripple if moved enough
    if (dist > 35) {
      const intensity = (typeof window !== 'undefined' && (window as any).__RIPPLE_INTENSITY__) || 1.0;
      if (ripplesRef.current.length < 32) {
        ripplesRef.current.push({
          x,
          y,
          radius: 2,
          maxRadius: (75 + Math.random() * 35) * (0.7 + 0.4 * intensity),
          strength: 0.45 * intensity,
          speed: 1.5 * (0.8 + 0.25 * intensity),
          opacity: Math.min(1.0, 0.55 * intensity)
        });
        
        // Occasional soft audio ripple drop
        if (Math.random() < 0.15) {
          waterAudio.playRippleSound(1.0 + (Math.random() - 0.5) * 0.3);
        }
      }
      mousePosRef.current.lastX = x;
      mousePosRef.current.lastY = y;
    }
  };

  const handlePointerLeave = () => {
    mousePosRef.current.active = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const intensity = (typeof window !== 'undefined' && (window as any).__RIPPLE_INTENSITY__) || 1.0;

    // Big click ripple scaled by intensity
    ripplesRef.current.push({
      x,
      y,
      radius: 4,
      maxRadius: 130 * (0.7 + 0.4 * intensity),
      strength: 0.8 * intensity,
      speed: 2.2 * (0.8 + 0.3 * intensity),
      opacity: Math.min(1.0, 0.85 * intensity)
    });

    // Drop food flakes for Koi to swim to
    for (let i = 0; i < 4; i++) {
      foodRef.current.push({
        x: x + (Math.random() - 0.5) * 45,
        y: y + (Math.random() - 0.5) * 45,
        radius: 3.5,
        alpha: 0.95
      });
    }

    waterAudio.playRippleSound(0.9);
  };

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-crosshair"
        title="Move mouse to create ripples, click to feed koi fish"
      />

      {/* Floating Zen / Pond Adjuster Button */}
      <div className="absolute bottom-5 right-5 z-40 flex items-center gap-2">
        {showControls && (
          <div className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-4 text-xs shadow-2xl backdrop-blur-xl border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2">
              <span className="text-rose-200/80 font-medium whitespace-nowrap">Fish Opacity:</span>
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={transparency}
                onChange={(e) => setTransparency(parseFloat(e.target.value))}
                className="w-20 accent-rose-500 cursor-pointer"
              />
              <span className="text-white/90 tabular-nums w-8">{Math.round(transparency * 100)}%</span>
            </div>

            <div className="h-4 w-[1px] bg-white/20" />

            <div className="flex items-center gap-2">
              <span className="text-rose-200/80 font-medium whitespace-nowrap">Koi Count:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(n => (
                  <button
                    key={n}
                    onClick={() => setFishCount(n)}
                    className={`w-6 h-6 rounded-md text-xs font-semibold transition-all ${
                      fishCount === n
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-4 w-[1px] bg-white/20" />

            <button
              onClick={() => {
                const w = window.innerWidth;
                const h = window.innerHeight;
                for (let i = 0; i < 6; i++) {
                  foodRef.current.push({
                    x: w * 0.3 + Math.random() * (w * 0.4),
                    y: h * 0.3 + Math.random() * (h * 0.4),
                    radius: 3.5,
                    alpha: 0.95
                  });
                }
                waterAudio.playRippleSound(1.1);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 border border-rose-400/30 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span>🌿</span> Feed Koi
            </button>
          </div>
        )}

        <button
          onClick={() => setShowControls(!showControls)}
          className="p-2.5 rounded-full glass-panel hover:bg-rose-950/60 border border-rose-500/30 text-rose-200 hover:text-white transition-all shadow-lg flex items-center justify-center group"
          title="Adjust Koi Pond & Zen Ambience"
          aria-label="Pond Settings"
        >
          <span className="text-base group-hover:rotate-45 transition-transform duration-300">🎏</span>
        </button>
      </div>
    </div>
  );
};
