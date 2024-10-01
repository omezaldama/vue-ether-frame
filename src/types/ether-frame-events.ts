import { ResizeDirection } from './ether-frame-types';

export interface FrameData {
  contentHeight: number;
  contentWidth: number;
  frameX: number;
  frameY: number;
};

export interface ResizeData {
  direction: ResizeDirection;
};

export interface ResizeEventData {
  frameData: FrameData;
  resizeData: ResizeData;
};
