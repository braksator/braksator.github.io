export interface HyperCrushOptions {
  mode?: string;
}

declare function HyperCrush(opts?: HyperCrushOptions): NodeJS.ReadWriteStream;

export = HyperCrush;