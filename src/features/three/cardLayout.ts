interface CardLayoutInput {
  width: number;
  height: number;
  distance: number;
  fov: number;
  side: number;
  wide: boolean;
  aspect: number;
}

export function cardLayout({ width, height, distance, fov, side, wide, aspect }: CardLayoutInput) {
  const unit = 2 * (distance - 4) * Math.tan(fov * Math.PI / 360) / height;
  const viewWidth = unit * width;
  if (width >= 1024) {
    // Approved desktop values, unchanged.
    const x = side * viewWidth * (wide ? .305 : .29);
    return { x, y: 1, width: Math.min(wide ? 5.8 : 4.8, viewWidth * (wide ? .235 : .205)),
      enterX: x + side * 2, enterY: 1.25, enterZ: -9, enterYaw: side * .72,
      approachX: x + side * .8, approachY: 1.1, approachYaw: side * .38,
      exitX: side * .4, exitY: -.35, exitYaw: -side * .95 };
  }
  const mobile = width < 768;
  const landscape = width > height && height < 600;
  const pixelWidth = Math.min(width * (landscape ? .38 : mobile ? .82 : .38), 320, height * (landscape ? .74 : .57) / aspect);
  const x = (landscape ? width * .25 : side * width * (mobile ? .02 : .25)) * unit;
  const y = height * (.5 - (landscape ? .55 : mobile ? .67 : .63)) * unit;
  const exitUnit = 2 * (distance + 9) * Math.tan(fov * Math.PI / 360) / height;
  return { x, y, width: pixelWidth * unit,
    enterX: x + side * unit * (mobile ? 14 : 28), enterY: y + unit * 12, enterZ: -6, enterYaw: side * .22,
    approachX: x + side * unit * 6, approachY: y, approachYaw: side * .12,
    exitX: landscape ? -width * .22 * exitUnit : 0,
    exitY: height * (.5 - (landscape ? .52 : mobile ? .29 : .4)) * exitUnit, exitYaw: -side * .38 };
}
