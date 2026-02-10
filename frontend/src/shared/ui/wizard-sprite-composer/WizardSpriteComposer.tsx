import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { useMemo, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

type Pixel = {
  x: number;
  y: number;
  color: string;
};

type Palette = {
  main: string;
  dark: string;
  accent: string;
  highlight: string;
};

const GRID_SIZE = 32;
const PIXEL_SIZE = 4;
const CANVAS_SIZE = GRID_SIZE * PIXEL_SIZE;
const VARIANT_COUNT = 8;

const useWizardSpriteStyles = createStyles(({ token }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: token.marginSM,
  },
  canvasWrap: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    borderRadius: token.borderRadiusLG,
    border: `1px solid ${token.colorBorder}`,
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: token.marginXS,
  },
  controlRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginXS,
  },
  variantValue: {
    minWidth: 48,
    textAlign: 'center',
  },
}));

const headPalettes: Palette[] = [
  { main: '#7c3aed', dark: '#5b21b6', accent: '#fcd34d', highlight: '#fbbf24' },
  { main: '#0f766e', dark: '#134e4a', accent: '#fde68a', highlight: '#fbbf24' },
  { main: '#be123c', dark: '#881337', accent: '#fde047', highlight: '#facc15' },
  { main: '#2563eb', dark: '#1e3a8a', accent: '#fef08a', highlight: '#fde047' },
  { main: '#7c2d12', dark: '#431407', accent: '#fca5a5', highlight: '#fecaca' },
  { main: '#1d4ed8', dark: '#1e3a8a', accent: '#bae6fd', highlight: '#e0f2fe' },
  { main: '#6d28d9', dark: '#4c1d95', accent: '#fef3c7', highlight: '#fde68a' },
  { main: '#0f172a', dark: '#020617', accent: '#e2e8f0', highlight: '#f8fafc' },
];

const robePalettes: Palette[] = [
  { main: '#1e293b', dark: '#0f172a', accent: '#38bdf8', highlight: '#bae6fd' },
  { main: '#111827', dark: '#0f172a', accent: '#a855f7', highlight: '#f5d0fe' },
  { main: '#312e81', dark: '#1e1b4b', accent: '#f472b6', highlight: '#fbcfe8' },
  { main: '#0f766e', dark: '#134e4a', accent: '#facc15', highlight: '#fde047' },
  { main: '#4c1d95', dark: '#2e1065', accent: '#60a5fa', highlight: '#bae6fd' },
  { main: '#7c2d12', dark: '#431407', accent: '#fca5a5', highlight: '#fecaca' },
  { main: '#065f46', dark: '#064e3b', accent: '#fcd34d', highlight: '#fde68a' },
  { main: '#1f2937', dark: '#111827', accent: '#a78bfa', highlight: '#ddd6fe' },
];

const bootPalettes: Palette[] = [
  { main: '#0f172a', dark: '#020617', accent: '#f59e0b', highlight: '#fcd34d' },
  { main: '#1f2937', dark: '#111827', accent: '#f97316', highlight: '#fdba74' },
  { main: '#312e81', dark: '#1e1b4b', accent: '#f472b6', highlight: '#fbcfe8' },
  { main: '#7c2d12', dark: '#431407', accent: '#facc15', highlight: '#fde68a' },
  { main: '#1d4ed8', dark: '#1e3a8a', accent: '#38bdf8', highlight: '#bae6fd' },
  { main: '#4c1d95', dark: '#2e1065', accent: '#c084fc', highlight: '#e9d5ff' },
  { main: '#0f766e', dark: '#134e4a', accent: '#f472b6', highlight: '#fbcfe8' },
  { main: '#334155', dark: '#1e293b', accent: '#94a3b8', highlight: '#e2e8f0' },
];

const staffPalettes: Palette[] = [
  { main: '#7c2d12', dark: '#431407', accent: '#38bdf8', highlight: '#bae6fd' },
  { main: '#4b5563', dark: '#1f2937', accent: '#f59e0b', highlight: '#fde68a' },
  { main: '#5b21b6', dark: '#2e1065', accent: '#f472b6', highlight: '#fbcfe8' },
  { main: '#0f766e', dark: '#134e4a', accent: '#facc15', highlight: '#fde68a' },
  { main: '#1f2937', dark: '#111827', accent: '#c084fc', highlight: '#e9d5ff' },
  { main: '#6b7280', dark: '#374151', accent: '#34d399', highlight: '#a7f3d0' },
  { main: '#3f3f46', dark: '#18181b', accent: '#f87171', highlight: '#fecaca' },
  { main: '#1e3a8a', dark: '#172554', accent: '#60a5fa', highlight: '#bfdbfe' },
];

const skinTones = [
  { base: '#f8d7c0', shadow: '#e2b9a2', beard: '#6b4f3f' },
  { base: '#f1c6a8', shadow: '#d9a689', beard: '#5b3a29' },
  { base: '#f4d0b5', shadow: '#ddb599', beard: '#7a4a2a' },
  { base: '#f0c4a2', shadow: '#d3a585', beard: '#5c3b2e' },
  { base: '#f6d4bd', shadow: '#e2b9a2', beard: '#7c4a3c' },
  { base: '#e9bfa1', shadow: '#d1a386', beard: '#5c3b2e' },
  { base: '#f2c7ad', shadow: '#d5a98f', beard: '#6b4b3a' },
  { base: '#f7d9c4', shadow: '#dfbca6', beard: '#735142' },
];

const addRect = (
  pixels: Pixel[],
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) => {
  for (let offsetY = 0; offsetY < h; offsetY += 1) {
    for (let offsetX = 0; offsetX < w; offsetX += 1) {
      pixels.push({ x: x + offsetX, y: y + offsetY, color });
    }
  }
};

const addPixel = (pixels: Pixel[], x: number, y: number, color: string) => {
  pixels.push({ x, y, color });
};

const buildHead = (index: number) => {
  const palette = headPalettes[index];
  const skin = skinTones[index];
  const pixels: Pixel[] = [];

  const hatStyle = index % 4;
  if (hatStyle === 0) {
    addRect(pixels, 11, 0, 4, 1, palette.main);
    addRect(pixels, 10, 1, 6, 2, palette.main);
    addRect(pixels, 9, 3, 8, 2, palette.main);
    addRect(pixels, 8, 5, 9, 1, palette.dark);
    addPixel(pixels, 15, 1, palette.accent);
  }
  if (hatStyle === 1) {
    addRect(pixels, 9, 2, 9, 3, palette.main);
    addRect(pixels, 8, 5, 10, 1, palette.dark);
    addRect(pixels, 10, 1, 5, 1, palette.highlight);
    addRect(pixels, 14, 1, 3, 1, palette.accent);
  }
  if (hatStyle === 2) {
    addRect(pixels, 10, 2, 6, 2, palette.main);
    addRect(pixels, 9, 4, 7, 1, palette.main);
    addRect(pixels, 8, 5, 9, 1, palette.dark);
    addRect(pixels, 11, 1, 4, 1, palette.accent);
    addPixel(pixels, 14, 2, palette.highlight);
  }
  if (hatStyle === 3) {
    addRect(pixels, 9, 1, 7, 2, palette.main);
    addRect(pixels, 8, 3, 9, 2, palette.main);
    addRect(pixels, 7, 5, 11, 1, palette.dark);
    addRect(pixels, 12, 2, 2, 1, palette.accent);
    addPixel(pixels, 15, 3, palette.highlight);
  }

  addRect(pixels, 10, 6, 6, 4, skin.base);
  addRect(pixels, 16, 7, 2, 2, skin.shadow);
  addPixel(pixels, 15, 8, skin.shadow);

  const beardStyle = index % 4;
  if (beardStyle === 0) {
    addRect(pixels, 12, 10, 5, 2, skin.beard);
    addRect(pixels, 11, 11, 5, 2, skin.beard);
  }
  if (beardStyle === 1) {
    addRect(pixels, 11, 10, 6, 1, skin.beard);
    addRect(pixels, 11, 11, 6, 2, skin.beard);
    addRect(pixels, 12, 13, 3, 1, skin.beard);
  }
  if (beardStyle === 2) {
    addRect(pixels, 12, 10, 4, 1, skin.beard);
    addRect(pixels, 11, 11, 4, 2, skin.beard);
    addRect(pixels, 10, 12, 2, 1, skin.beard);
  }
  if (beardStyle === 3) {
    addRect(pixels, 11, 10, 5, 2, skin.beard);
    addRect(pixels, 12, 12, 5, 1, skin.beard);
    addRect(pixels, 14, 13, 2, 1, skin.beard);
  }

  addRect(pixels, 9, 9, 2, 2, palette.dark);
  addRect(pixels, 9, 12, 2, 2, palette.dark);
  addRect(pixels, 8, 8, 1, 1, palette.highlight);
  return pixels;
};

const buildRobe = (index: number) => {
  const palette = robePalettes[index];
  const pixels: Pixel[] = [];

  const robeStyle = index % 4;
  if (robeStyle === 0) {
    addRect(pixels, 9, 13, 8, 6, palette.main);
    addRect(pixels, 8, 16, 10, 6, palette.main);
    addRect(pixels, 7, 20, 12, 4, palette.dark);
  }
  if (robeStyle === 1) {
    addRect(pixels, 9, 13, 7, 5, palette.main);
    addRect(pixels, 8, 17, 9, 5, palette.main);
    addRect(pixels, 7, 21, 11, 3, palette.dark);
    addRect(pixels, 14, 16, 2, 5, palette.dark);
  }
  if (robeStyle === 2) {
    addRect(pixels, 10, 13, 7, 6, palette.main);
    addRect(pixels, 9, 17, 9, 5, palette.main);
    addRect(pixels, 8, 21, 11, 3, palette.dark);
    addRect(pixels, 11, 19, 2, 3, palette.dark);
  }
  if (robeStyle === 3) {
    addRect(pixels, 9, 14, 8, 5, palette.main);
    addRect(pixels, 8, 18, 10, 4, palette.main);
    addRect(pixels, 7, 21, 12, 3, palette.dark);
    addRect(pixels, 12, 16, 2, 6, palette.dark);
  }

  addRect(pixels, 11, 18, 6, 1, palette.accent);
  addRect(pixels, 13, 14, 4, 3, palette.accent);
  addPixel(pixels, 12, 15, palette.highlight);
  addPixel(pixels, 15, 17, palette.highlight);
  addPixel(pixels, 10, 19, palette.highlight);

  addRect(pixels, 17, 14, 2, 4, palette.dark);
  addRect(pixels, 18, 16, 2, 2, palette.accent);
  return pixels;
};

const buildBoots = (index: number) => {
  const palette = bootPalettes[index];
  const pixels: Pixel[] = [];

  const bootStyle = index % 4;
  if (bootStyle === 0) {
    addRect(pixels, 9, 24, 6, 3, palette.main);
    addRect(pixels, 8, 26, 6, 2, palette.dark);
    addRect(pixels, 13, 25, 4, 2, palette.main);
  }
  if (bootStyle === 1) {
    addRect(pixels, 9, 23, 5, 4, palette.main);
    addRect(pixels, 8, 26, 6, 2, palette.dark);
    addRect(pixels, 14, 24, 4, 3, palette.main);
  }
  if (bootStyle === 2) {
    addRect(pixels, 9, 25, 5, 2, palette.main);
    addRect(pixels, 8, 26, 6, 2, palette.dark);
    addRect(pixels, 13, 24, 5, 3, palette.main);
    addRect(pixels, 14, 26, 4, 1, palette.dark);
  }
  if (bootStyle === 3) {
    addRect(pixels, 9, 24, 4, 3, palette.main);
    addRect(pixels, 8, 26, 5, 2, palette.dark);
    addRect(pixels, 12, 24, 6, 3, palette.main);
  }

  addRect(pixels, 13, 26, 4, 1, palette.dark);
  addPixel(pixels, 10, 25, palette.highlight);
  addPixel(pixels, 14, 25, palette.accent);
  return pixels;
};

const buildStaff = (index: number) => {
  const palette = staffPalettes[index];
  const pixels: Pixel[] = [];

  const staffStyle = index % 4;
  if (staffStyle === 0) {
    addRect(pixels, 21, 6, 1, 19, palette.main);
    addRect(pixels, 20, 6, 1, 6, palette.dark);
    addRect(pixels, 21, 10, 1, 6, palette.dark);
    addRect(pixels, 20, 4, 3, 2, palette.accent);
    addRect(pixels, 19, 5, 1, 1, palette.highlight);
    addPixel(pixels, 22, 5, palette.highlight);
    addPixel(pixels, 21, 3, palette.highlight);
  }
  if (staffStyle === 1) {
    addRect(pixels, 20, 7, 1, 18, palette.main);
    addRect(pixels, 21, 7, 1, 10, palette.dark);
    addRect(pixels, 19, 4, 3, 2, palette.accent);
    addRect(pixels, 22, 4, 1, 2, palette.highlight);
    addPixel(pixels, 18, 5, palette.highlight);
  }
  if (staffStyle === 2) {
    addRect(pixels, 21, 6, 1, 18, palette.main);
    addRect(pixels, 20, 8, 1, 6, palette.dark);
    addRect(pixels, 22, 8, 1, 6, palette.dark);
    addRect(pixels, 20, 3, 3, 2, palette.accent);
    addRect(pixels, 22, 2, 1, 1, palette.highlight);
    addPixel(pixels, 19, 4, palette.highlight);
  }
  if (staffStyle === 3) {
    addRect(pixels, 20, 6, 1, 19, palette.main);
    addRect(pixels, 21, 6, 1, 6, palette.dark);
    addRect(pixels, 19, 4, 2, 2, palette.accent);
    addRect(pixels, 21, 4, 2, 2, palette.accent);
    addPixel(pixels, 22, 3, palette.highlight);
    addPixel(pixels, 18, 5, palette.highlight);
  }
  return pixels;
};

type ControlRowProps = {
  label: string;
  value: number;
  onPrev: () => void;
  onNext: () => void;
};

function ControlRow({ label, value, onPrev, onNext }: ControlRowProps) {
  const { styles } = useWizardSpriteStyles();
  return (
    <div className={styles.controlRow}>
      <Typography.Text>{label}</Typography.Text>
      <div className={styles.controlGroup}>
        <Button size="small" icon={<LeftOutlined />} onClick={onPrev} />
        <Typography.Text className={styles.variantValue}>
          {value + 1}/{VARIANT_COUNT}
        </Typography.Text>
        <Button size="small" icon={<RightOutlined />} onClick={onNext} />
      </div>
    </div>
  );
}

export function WizardSpriteComposer() {
  const { styles } = useWizardSpriteStyles();
  const [headIndex, setHeadIndex] = useState(0);
  const [robeIndex, setRobeIndex] = useState(0);
  const [bootIndex, setBootIndex] = useState(0);
  const [staffIndex, setStaffIndex] = useState(0);

  const pixels = useMemo(() => {
    return [
      ...buildStaff(staffIndex),
      ...buildRobe(robeIndex),
      ...buildBoots(bootIndex),
      ...buildHead(headIndex),
    ];
  }, [headIndex, robeIndex, bootIndex, staffIndex]);

  const handlePrev = (setter: (value: number) => void, value: number) => {
    setter((value + VARIANT_COUNT - 1) % VARIANT_COUNT);
  };

  const handleNext = (setter: (value: number) => void, value: number) => {
    setter((value + 1) % VARIANT_COUNT);
  };

  return (
    <div className={styles.root}>
      <div className={styles.canvasWrap}>
        <Stage width={CANVAS_SIZE} height={CANVAS_SIZE}>
          <Layer>
            <Rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="#ffffff" />
            {pixels.map((pixel, index) => (
              <Rect
                key={`${pixel.x}-${pixel.y}-${index}`}
                x={pixel.x * PIXEL_SIZE}
                y={pixel.y * PIXEL_SIZE}
                width={PIXEL_SIZE}
                height={PIXEL_SIZE}
                fill={pixel.color}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <div className={styles.controls}>
        <ControlRow
          label="Голова"
          value={headIndex}
          onPrev={() => handlePrev(setHeadIndex, headIndex)}
          onNext={() => handleNext(setHeadIndex, headIndex)}
        />
        <ControlRow
          label="Мантия"
          value={robeIndex}
          onPrev={() => handlePrev(setRobeIndex, robeIndex)}
          onNext={() => handleNext(setRobeIndex, robeIndex)}
        />
        <ControlRow
          label="Ботинки"
          value={bootIndex}
          onPrev={() => handlePrev(setBootIndex, bootIndex)}
          onNext={() => handleNext(setBootIndex, bootIndex)}
        />
        <ControlRow
          label="Посох"
          value={staffIndex}
          onPrev={() => handlePrev(setStaffIndex, staffIndex)}
          onNext={() => handleNext(setStaffIndex, staffIndex)}
        />
      </div>
    </div>
  );
}
