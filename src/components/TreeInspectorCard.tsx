import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { DoubleSide, Group, MathUtils } from 'three';
import type { MotionLevel, TreeInspectorModel } from '../core/inspection/treeInspector';

interface TreeInspectorCardProps {
  open: boolean;
  motionLevel: MotionLevel;
  title: string;
  subtitle: string;
  model: TreeInspectorModel;
}

export function TreeInspectorCard({ open, motionLevel, title, subtitle, model }: TreeInspectorCardProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Optional 3D preview</p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Secondary mode</span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
        <div className="h-[280px] w-full sm:h-[360px]">
          <Canvas camera={{ position: [8, 5, 8], fov: 38 }} dpr={[1, 1.5]}>
            <color attach="background" args={['#f8fafc']} />
            <ambientLight intensity={0.75} />
            <directionalLight position={[6, 10, 5]} intensity={1.2} />
            <directionalLight position={[-5, 4, -4]} intensity={0.35} />
            <TreeInspectionScene model={model} motionLevel={motionLevel} />
          </Canvas>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <PreviewMetric label="Fall zone radius" value={`${(model.height * 0.8).toFixed(1)} m`} />
        <PreviewMetric label="Utility offset" value={`${model.utilityOffset.toFixed(1)} m`} />
        <PreviewMetric label="Terrain tilt" value={`${model.terrainTilt.toFixed(1)} deg`} />
      </div>
    </div>
  );
}

export default TreeInspectorCard;

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function TreeInspectionScene({ model, motionLevel }: { model: TreeInspectorModel; motionLevel: MotionLevel }) {
  const swayGroup = useRef<Group>(null);
  const crownWidth = model.crownWidth / 2;
  const trunkHeight = model.height;
  const trunkRadius = model.trunkDiameter / 2;
  const branchCount = model.branchMix === 'small' ? 4 : model.branchMix === 'medium' ? 6 : 8;

  useFrame(({ clock }) => {
    if (!swayGroup.current) {
      return;
    }

    const baseLean = MathUtils.degToRad(model.leanAngle);
    const swayAmplitude = motionLevel === 'low' ? model.swayAmount * 0.2 : model.swayAmount;
    swayGroup.current.rotation.z = baseLean + Math.sin(clock.getElapsedTime() * 0.8) * swayAmplitude * 0.06;
  });

  return (
    <>
      <group rotation={[MathUtils.degToRad(model.terrainTilt), 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[18, 18]} />
          <meshStandardMaterial color="#dce7d6" />
        </mesh>
      </group>

      <group position={[model.utilityOffset, 0, 0]}>
        <mesh position={[0, 2.8, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 5.6, 16]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0, 5.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 7.4, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      <group ref={swayGroup}>
        <mesh position={[0, trunkHeight / 2, 0]}>
          <cylinderGeometry args={[trunkRadius * 0.82, trunkRadius, trunkHeight, 18]} />
          <meshStandardMaterial color="#6b4f3a" />
        </mesh>

        {Array.from({ length: branchCount }).map((_, index) => {
          const y = trunkHeight * (0.42 + index * (0.4 / Math.max(branchCount - 1, 1)));
          const branchLength = crownWidth * (0.7 + (index % 3) * 0.12);
          const direction = index % 2 === 0 ? 1 : -1;
          const rotationZ = MathUtils.degToRad(direction * (24 + index * 3));

          return (
            <mesh key={index} position={[direction * branchLength * 0.28, y, 0]} rotation={[0, 0, rotationZ]}>
              <cylinderGeometry args={[0.035, 0.055, branchLength, 8]} />
              <meshStandardMaterial color="#7c5b44" />
            </mesh>
          );
        })}

        <mesh position={[0, trunkHeight * 0.82, 0]}>
          <sphereGeometry args={[Math.max(crownWidth * 0.68, 1.2), 28, 28]} />
          <meshStandardMaterial color="#86a77a" transparent opacity={0.92} />
        </mesh>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, MathUtils.degToRad(model.failureDirection)]} position={[0, 0.01, 0]}>
        <ringGeometry args={[trunkHeight * 0.75, trunkHeight * 0.82, 48, 1, 0, Math.PI / 3]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.3} side={DoubleSide} />
      </mesh>
    </>
  );
}
