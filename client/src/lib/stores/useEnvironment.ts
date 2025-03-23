import { create } from 'zustand';
import type { Object3D, Vector3 } from 'three';
import type { User } from '@shared/types';

export type EnvironmentType = 'cafe' | 'street' | 'abandoned';

interface EnvironmentObject {
  id: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  type: string;
  interactive?: boolean;
}

export interface Environment {
  id: string;
  name: string;
  type: EnvironmentType;
  description: string;
  objects: EnvironmentObject[];
  spawnPoints: [number, number, number][];
}

interface EnvironmentState {
  currentEnvironment: Environment | null;
  environments: Environment[];
  participants: Map<number, {
    user: User;
    position: [number, number, number];
    rotation: [number, number, number];
  }>;
  userPosition: [number, number, number];
  userRotation: [number, number, number];
  loadingEnvironment: boolean;
  
  selectEnvironment: (environmentId: string) => void;
  updateUserPosition: (position: [number, number, number]) => void;
  updateUserRotation: (rotation: [number, number, number]) => void;
  addParticipant: (user: User, position: [number, number, number], rotation: [number, number, number]) => void;
  removeParticipant: (userId: number) => void;
  updateParticipantPosition: (userId: number, position: [number, number, number]) => void;
  updateParticipantRotation: (userId: number, rotation: [number, number, number]) => void;
}

// Predefined environments
const environments: Environment[] = [
  {
    id: 'cafe',
    name: 'Cozy Cafe',
    type: 'cafe',
    description: 'A warm and inviting cafe with a relaxed atmosphere - perfect for a first date.',
    objects: [
      { id: 'floor', position: [0, 0, 0], type: 'floor', scale: [20, 1, 20] },
      { id: 'table1', position: [2, 0.5, 0], type: 'table', interactive: true },
      { id: 'table2', position: [-2, 0.5, -3], type: 'table', interactive: true },
      { id: 'counter', position: [-5, 1, -5], type: 'counter' },
      { id: 'chair1', position: [1.5, 0.5, 1], type: 'chair', rotation: [0, Math.PI, 0], interactive: true },
      { id: 'chair2', position: [2.5, 0.5, -1], type: 'chair', rotation: [0, 0, 0], interactive: true },
      { id: 'chair3', position: [-1.5, 0.5, -2.5], type: 'chair', rotation: [0, Math.PI / 4, 0], interactive: true },
      { id: 'chair4', position: [-2.5, 0.5, -3.5], type: 'chair', rotation: [0, -Math.PI / 4, 0], interactive: true },
      { id: 'plant1', position: [4, 0, 4], type: 'plant' },
      { id: 'plant2', position: [-4, 0, 4], type: 'plant' },
      { id: 'light1', position: [0, 5, 0], type: 'light' },
      { id: 'light2', position: [5, 5, 5], type: 'light' },
      { id: 'light3', position: [-5, 5, -5], type: 'light' },
    ],
    spawnPoints: [
      [0, 1, 5],
      [4, 1, 4],
      [-4, 1, 0],
    ]
  },
  {
    id: 'street',
    name: 'Neon Street',
    type: 'street',
    description: 'A vibrant cyberpunk street with neon lights and a futuristic atmosphere.',
    objects: [
      { id: 'road', position: [0, 0, 0], type: 'road', scale: [10, 1, 30] },
      { id: 'sidewalk1', position: [7, 0.1, 0], type: 'sidewalk', scale: [4, 1, 30] },
      { id: 'sidewalk2', position: [-7, 0.1, 0], type: 'sidewalk', scale: [4, 1, 30] },
      { id: 'building1', position: [12, 10, -5], type: 'building', scale: [6, 20, 10] },
      { id: 'building2', position: [12, 15, 10], type: 'building', scale: [6, 30, 15] },
      { id: 'building3', position: [-12, 12, -10], type: 'building', scale: [6, 24, 12] },
      { id: 'building4', position: [-12, 8, 8], type: 'building', scale: [6, 16, 14] },
      { id: 'neonSign1', position: [10, 5, 0], type: 'neonSign', rotation: [0, -Math.PI / 2, 0] },
      { id: 'neonSign2', position: [-10, 4, -5], type: 'neonSign', rotation: [0, Math.PI / 2, 0] },
      { id: 'streetLight1', position: [5, 3, -10], type: 'streetLight' },
      { id: 'streetLight2', position: [5, 3, -5], type: 'streetLight' },
      { id: 'streetLight3', position: [5, 3, 0], type: 'streetLight' },
      { id: 'streetLight4', position: [5, 3, 5], type: 'streetLight' },
      { id: 'streetLight5', position: [5, 3, 10], type: 'streetLight' },
      { id: 'streetLight6', position: [-5, 3, -10], type: 'streetLight' },
      { id: 'streetLight7', position: [-5, 3, -5], type: 'streetLight' },
      { id: 'streetLight8', position: [-5, 3, 0], type: 'streetLight' },
      { id: 'streetLight9', position: [-5, 3, 5], type: 'streetLight' },
      { id: 'streetLight10', position: [-5, 3, 10], type: 'streetLight' },
    ],
    spawnPoints: [
      [0, 1, 10],
      [4, 1, 8],
      [-4, 1, 5],
    ]
  },
  {
    id: 'abandoned',
    name: 'Abandoned Factory',
    type: 'abandoned',
    description: 'An eerie abandoned factory with a mysterious atmosphere - perfect for adventurous explorers.',
    objects: [
      { id: 'floor', position: [0, 0, 0], type: 'floor', scale: [30, 1, 30] },
      { id: 'wall1', position: [15, 5, 0], type: 'wall', scale: [1, 10, 30] },
      { id: 'wall2', position: [-15, 5, 0], type: 'wall', scale: [1, 10, 30] },
      { id: 'wall3', position: [0, 5, 15], type: 'wall', scale: [30, 10, 1] },
      { id: 'wall4', position: [0, 5, -15], type: 'wall', scale: [30, 10, 1] },
      { id: 'machinery1', position: [5, 1, 5], type: 'machinery', rotation: [0, Math.PI / 4, 0] },
      { id: 'machinery2', position: [-8, 1, -6], type: 'machinery' },
      { id: 'crate1', position: [10, 0.5, 10], type: 'crate', interactive: true },
      { id: 'crate2', position: [9, 0.5, 10], type: 'crate', interactive: true },
      { id: 'crate3', position: [9.5, 1.5, 10], type: 'crate', scale: [0.8, 0.8, 0.8], interactive: true },
      { id: 'barrel1', position: [-5, 1, 8], type: 'barrel', interactive: true },
      { id: 'barrel2', position: [-6, 1, 8], type: 'barrel', interactive: true },
      { id: 'barrel3', position: [-5.5, 1, 7], type: 'barrel', interactive: true },
      { id: 'brokenLight1', position: [0, 9, 0], type: 'brokenLight' },
      { id: 'brokenLight2', position: [8, 9, 8], type: 'brokenLight' },
      { id: 'brokenLight3', position: [-8, 9, -8], type: 'brokenLight' },
      { id: 'window1', position: [15, 5, -5], type: 'brokenWindow', rotation: [0, -Math.PI / 2, 0] },
      { id: 'window2', position: [15, 5, 5], type: 'brokenWindow', rotation: [0, -Math.PI / 2, 0] },
      { id: 'window3', position: [-15, 5, -10], type: 'brokenWindow', rotation: [0, Math.PI / 2, 0] },
      { id: 'window4', position: [-15, 5, 0], type: 'brokenWindow', rotation: [0, Math.PI / 2, 0] },
      { id: 'window5', position: [-15, 5, 10], type: 'brokenWindow', rotation: [0, Math.PI / 2, 0] },
    ],
    spawnPoints: [
      [0, 1, 10],
      [5, 1, 8],
      [-5, 1, 5],
    ]
  }
];

export const useEnvironment = create<EnvironmentState>((set, get) => ({
  currentEnvironment: null,
  environments,
  participants: new Map(),
  userPosition: [0, 1, 0],
  userRotation: [0, 0, 0],
  loadingEnvironment: false,
  
  selectEnvironment: (environmentId) => {
    set({ loadingEnvironment: true });
    
    // Find the environment
    const environment = environments.find(env => env.id === environmentId);
    if (!environment) {
      console.error(`Environment with id ${environmentId} not found`);
      set({ loadingEnvironment: false });
      return;
    }
    
    // Get a random spawn point
    const spawnPoint = environment.spawnPoints[
      Math.floor(Math.random() * environment.spawnPoints.length)
    ];
    
    // Clear participants and set new environment
    set({
      currentEnvironment: environment,
      participants: new Map(),
      userPosition: spawnPoint,
      userRotation: [0, 0, 0],
      loadingEnvironment: false
    });
  },
  
  updateUserPosition: (position) => {
    set({ userPosition: position });
  },
  
  updateUserRotation: (rotation) => {
    set({ userRotation: rotation });
  },
  
  addParticipant: (user, position, rotation) => {
    const { participants } = get();
    const newParticipants = new Map(participants);
    newParticipants.set(user.id, { user, position, rotation });
    set({ participants: newParticipants });
  },
  
  removeParticipant: (userId) => {
    const { participants } = get();
    const newParticipants = new Map(participants);
    newParticipants.delete(userId);
    set({ participants: newParticipants });
  },
  
  updateParticipantPosition: (userId, position) => {
    const { participants } = get();
    const participant = participants.get(userId);
    if (!participant) return;
    
    const newParticipants = new Map(participants);
    newParticipants.set(userId, { ...participant, position });
    set({ participants: newParticipants });
  },
  
  updateParticipantRotation: (userId, rotation) => {
    const { participants } = get();
    const participant = participants.get(userId);
    if (!participant) return;
    
    const newParticipants = new Map(participants);
    newParticipants.set(userId, { ...participant, rotation });
    set({ participants: newParticipants });
  }
}));
