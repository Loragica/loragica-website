/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CognitiveNode {
  id: number;
  key: string;
  label: string;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  size: number;
  status: string;
  info: string;
}

export type WaveType = 'sine' | 'fourier' | 'chaos';

export interface SandboxQuadrant {
  id: number;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  angle: number;
  angleVel: number;
  w: number;
  h: number;
  isDragging: boolean;
}
