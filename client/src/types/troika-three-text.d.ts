declare module 'troika-three-text' {
  import { Object3D } from 'three';
  
  export class Text extends Object3D {
    text: string;
    anchorX: 'left' | 'center' | 'right';
    anchorY: 'top' | 'middle' | 'bottom';
    color: string;
    fontSize: number;
    fontWeight: number | string;
    letterSpacing: number;
    lineHeight: number;
    material: any;
    maxWidth: number;
    overflowWrap: 'normal' | 'break-word';
    textAlign: 'left' | 'center' | 'right';
    textIndent: number;
    whiteSpace: 'normal' | 'nowrap';
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    strokeColor: string;
    strokeWidth: number;
    fillOpacity: number;
    strokeOpacity: number;
    sync: () => void;
  }
  
  export function useTextGeometry(props: any): any;
  export function useTextMaterial(props: any): any;
}