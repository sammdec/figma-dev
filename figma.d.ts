// Global variable with Figma's plugin API.
declare const figma: PluginAPI
declare const __html__: string

interface PluginAPI {
  readonly currentPage: PageNode

  // Root of the current Figma document.
  readonly root: DocumentNode

  // API for accessing viewport information.
  readonly viewport: ViewportAPI

  // call this once your plugin is finished executing.
  closePlugin(): void

  // Command that the user chose through menu when launching the plugin.
  readonly command: string

  // Finds a node by its id. If not found, returns null.
  getNodeById(id: string): BaseNode | null

  // Finds a style by its id. If not found, returns null.
  getStyleById(id: string): BaseStyle | null

  // Access browser APIs and/or show UI to the user.
  showUI(html: string, options?: ShowUIOptions): void
  readonly ui: UIAPI

  // Creates new nodes. Nodes will start off inserted
  // into the current page.
  // To move them elsewhere use`appendChild` or`insertChild`
  createRectangle(): RectangleNode
  createLine(): LineNode
  createEllipse(): EllipseNode
  createPolygon(): PolygonNode
  createStar(): StarNode
  createVector(): VectorNode
  createText(): TextNode
  createBooleanOperation(): BooleanOperationNode
  createFrame(): FrameNode
  createComponent(): ComponentNode
  createPage(): PageNode
  createSlice(): SliceNode

  // Creates styles. A style's id can be assigned to
  // node properties like textStyleId, fillStyleId, etc.
  createPaintStyle(): PaintStyle
  createTextStyle(): TextStyle
  createEffectStyle(): EffectStyle
  createGridStyle(): GridStyle

  // Creates node from an SVG string.
  createNodeFromSvg(svg: string): FrameNode

  // Creates an Image object using the provided file contents.
  createImage(data: Uint8Array): Image

  // Groups every node in `nodes` under a new group.
  group(nodes: Array<BaseNode>, parent: BaseNode & ChildrenMixin, index?: number): FrameNode
}

type ShowUIOptions = {
  visible?: boolean, // defaults to true
  width?: number,    // defaults to 300
  height?: number,   // defaults to 200
}

interface UIAPI {
  show(): void
  hide(): void
  resize(width: number, height: number): void
  close(): void

  // Sends a message to the iframe.
  postMessage(pluginMessage: any): void

  // Registers a callback for messages sent by the iframe.
  onmessage: ((pluginMessage: any) => void) | undefined
}

interface ViewportAPI {
  center: { x: number, y: number }

  // 1.0 means 100% zoom, 0.5 means 50% zoom.
  zoom: number

  // Adjust the viewport such that it shows the provided nodes.
  scrollAndZoomIntoView(nodes: BaseNode[])
}

// Local development
// manifest.json format
interface ManifestJson {
  // Name of the extension.
  name: string

  // Version of the runtime that the extension uses, e.g. '0.3.0'.
  version: string

  // The file name that contains the extension code.
  script: string

  // The file name that contains the html code made available in script.
  html?: string

  // Shell command to be executed before the contents of the `html` and `script` files are read.
  build?: string

  // Menu items to show up in UI.
  menu?: ManifestMenuItem[]
}

type ManifestMenuItem =
  // Clickable menu item.
  { label: string, command: string } |
  // Separator
  { separator: true } |
  // Submenu
  { label: string, menu: ManifestMenuItem[] }

////////////////////////////////////////////////////////////////////////////////
// Values

// These are the top two rows of a 3x3 matrix. This is enough to represent
// translation, rotation, and skew.
type Transform = [
  [number, number, number],
  [number, number, number]
]

interface Vector {
  readonly x: number
  readonly y: number
}

interface RGB {
  readonly r: number
  readonly g: number
  readonly b: number
}

interface RGBA {
  readonly r: number
  readonly g: number
  readonly b: number
  readonly a: number
}

interface FontName {
  readonly family: string
  readonly style: string
}

interface ArcData {
  readonly startingAngle: number
  readonly endingAngle: number
  readonly innerRadius: number
}

interface ShadowEffect {
  readonly type: "DROP_SHADOW" | "INNER_SHADOW"
  readonly color: RGBA
  readonly offset: Vector
  readonly radius: number
  readonly visible: boolean
  readonly blendMode: BlendMode
}

interface BlurEffect {
  readonly type: "LAYER_BLUR" | "BACKGROUND_BLUR"
  readonly radius: number
  readonly visible: boolean
}

type Effect = ShadowEffect | BlurEffect

type ConstraintType = "MIN" | "CENTER" | "MAX" | "STRETCH" | "SCALE"

interface Constraints {
  readonly horizontal: ConstraintType
  readonly vertical: ConstraintType
}

interface ColorStop {
  readonly position: number
  readonly color: RGBA
}

interface SolidPaint {
  readonly type: "SOLID"
  readonly color: RGB

  readonly visible?: boolean
  readonly opacity?: number
}

interface GradientPaint {
  readonly type: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND"
  readonly gradientTransform: Transform
  readonly gradientStops: ReadonlyArray<ColorStop>

  readonly visible?: boolean
  readonly opacity?: number
}

interface ImagePaint {
  readonly type: "IMAGE"
  readonly scaleMode: "FILL" | "FIT" | "CROP" | "TILE"
  readonly image: Image | null
  readonly imageTransform?: Transform // setting for "CROP"
  readonly scalingFactor?: number // setting for "TILE"

  readonly visible?: boolean
  readonly opacity?: number
}

type Paint = SolidPaint | GradientPaint | ImagePaint

interface Guide {
  readonly axis: "X" | "Y"
  readonly offset: number
}

interface RowsColsLayoutGrid {
  readonly pattern: "ROWS" | "COLUMNS"
  readonly alignment: "MIN" | "STRETCH" | "CENTER"
  readonly gutterSize: number

  readonly count: number        // Infinity when "Auto" is set in the UI
  readonly sectionSize?: number // Not set for alignment: "STRETCH"
  readonly offset?: number      // Not set for alignment: "CENTER"

  readonly visible?: boolean
  readonly color?: RGBA
}

interface GridLayoutGrid {
  readonly pattern: "GRID"
  readonly sectionSize: number

  readonly visible?: boolean
  readonly color?: RGBA
}

type LayoutGrid = RowsColsLayoutGrid | GridLayoutGrid

interface ExportSettingsImage {
  format: "JPG" | "PNG"
  contentsOnly?: boolean    // defaults to true
  suffix?: string
  constraint?: {            // defaults to unscaled ({ type: "SCALE", value: 1 })
    type: "SCALE" | "WIDTH" | "HEIGHT"
    value: number
  }
}

interface ExportSettingsSVG {
  format: "SVG"
  contentsOnly?: boolean    // defaults to true
  suffix?: string
  svgOutlineText?: boolean  // defaults to true
  svgIdAttribute?: boolean  // defaults to false
  svgSimplifyStroke?: boolean // defaults to true
}

interface ExportSettingsPDF {
  format: "PDF"
  contentsOnly?: boolean    // defaults to true
  suffix?: string
}

type ExportSettings = ExportSettingsImage | ExportSettingsSVG | ExportSettingsPDF

type WindingRule = "nonzero" | "evenodd"

interface VectorVertex {
  readonly position: Vector
}

interface VectorHandle {
  readonly index: number
  readonly tangent: Vector
}

interface VectorSegment {
  readonly start: VectorHandle
  readonly end: VectorHandle
}

interface VectorRegion {
  readonly windingRule: WindingRule
  readonly loops: ReadonlyArray<ReadonlyArray<number>>
}

interface VectorNetwork {
  readonly vertices: ReadonlyArray<VectorVertex>
  readonly segments: ReadonlyArray<VectorSegment>
  readonly regions: ReadonlyArray<VectorRegion>
}

interface VectorPath {
  // Similar to the svg fill-rule
  // A null value means that an open path won't have a fill
  readonly windingRule: WindingRule | null
  readonly data: string
}

type VectorPaths = ReadonlyArray<VectorPath>

interface NumberWithUnits {
  readonly value: number
  readonly units: "PIXELS" | "PERCENT"
}

type BlendMode =
  "PASS_THROUGH" |
  "NORMAL" |
  "DARKEN" |
  "MULTIPLY" |
  "LINEAR_BURN" |
  "COLOR_BURN" |
  "LIGHTEN" |
  "SCREEN" |
  "LINEAR_DODGE" |
  "COLOR_DODGE" |
  "OVERLAY" |
  "SOFT_LIGHT" |
  "HARD_LIGHT" |
  "DIFFERENCE" |
  "EXCLUSION" |
  "HUE" |
  "SATURATION" |
  "COLOR" |
  "LUMINOSITY"

////////////////////////////////////////////////////////////////////////////////
// Mixins

interface BaseNodeMixin {
  readonly id: string
  readonly parent: (BaseNode & ChildrenMixin) | null
  name: string
  visible: boolean
  locked: boolean
  removed: boolean
  toString(): string
  remove(): void
}

interface ChildrenMixin {
  // Sorted back-to-front. I.e. the top-most child is last in this array.
  readonly children: ReadonlyArray<BaseNode>

  // Adds to the end of the .children array. I.e. visually on top of all other
  // children.
  appendChild(child: BaseNode): void

  insertChild(index: number, child: BaseNode): void
  findAll(callback?: (node: BaseNode) => boolean): ReadonlyArray<BaseNode>
  findOne(callback: (node: BaseNode) => boolean): BaseNode | null
}

interface LayoutMixin {
  readonly absoluteTransform: Transform
  relativeTransform: Transform
  x: number // The same as "relativeTransform[0][2]"
  y: number // The same as "relativeTransform[1][2]"

  readonly size: Vector
  readonly width: number // The same as "size.x"
  readonly height: number // The same as "size.y"

  // Resizes the node. If children of the node has constraints, it applies those constraints
  // width and height must be >= 0.01
  resize(width: number, height: number): void

  // Resizes the node. Children of the node are never resized, even if those children have
  // constraints. width and height must be >= 0.01
  resizeWithoutConstraints(width: number, height: number): void

  constraints: Constraints
}

interface BlendMixin {
  opacity: number
  blendMode: BlendMode
  isMask: boolean
  effects: ReadonlyArray<Effect>
  effectStyleId: string
}

interface FrameMixin {
  backgrounds: ReadonlyArray<Paint>
  layoutGrids: ReadonlyArray<LayoutGrid>
  clipsContent: boolean
  guides: ReadonlyArray<Guide>
  gridStyleId: string
  backgroundStyleId: string
}

interface GeometryMixin {
  fills: ReadonlyArray<Paint>
  strokes: ReadonlyArray<Paint>
  strokeWeight: number
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE"
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "ARROW_LINES" | "ARROW_EQUILATERAL"
  strokeJoin: "MITER" | "BEVEL" | "ROUND"
  dashPattern: ReadonlyArray<number>
  fillStyleId: string
  strokeStyleId: string
}

interface CornerMixin {
  cornerRadius: number
  cornerSmoothing: number
}

interface ExportMixin {
  exportSettings: ExportSettings[]
  exportAsync(settings?: ExportSettings): Promise<Uint8Array> // Defaults to PNG format
}

////////////////////////////////////////////////////////////////////////////////
// Nodes

interface DocumentNode extends BaseNodeMixin, ChildrenMixin {
  readonly type: "DOCUMENT"
  clone(): DocumentNode // Note: this always throws an error
}

interface PageNode extends BaseNodeMixin, ChildrenMixin, ExportMixin {
  readonly type: "PAGE"
  clone(): PageNode // cloned node starts off inserted into current page

  guides: ReadonlyArray<Guide>
  selection: ReadonlyArray<BaseNode>
}

interface FrameNode extends BaseNodeMixin, BlendMixin, ChildrenMixin, FrameMixin, LayoutMixin, ExportMixin {
  readonly type: "FRAME"
  clone(): FrameNode // cloned node starts off inserted into current page
}

interface SliceNode extends BaseNodeMixin, LayoutMixin, ExportMixin {
  readonly type: "SLICE"
  clone(): SliceNode // cloned node starts off inserted into current page
}

interface RectangleNode extends BaseNodeMixin, BlendMixin, CornerMixin, GeometryMixin, LayoutMixin, ExportMixin {
  readonly type: "RECTANGLE"
  clone(): RectangleNode // cloned node starts off inserted into current page
  topLeftRadius: number
  topRightRadius: number
  bottomLeftRadius: number
  bottomRightRadius: number
}

interface LineNode extends BaseNodeMixin, BlendMixin, GeometryMixin, LayoutMixin, ExportMixin {
  readonly type: "LINE"
  clone(): LineNode // cloned node starts off inserted into current page
}

interface EllipseNode extends BaseNodeMixin, BlendMixin, CornerMixin, GeometryMixin, LayoutMixin, ExportMixin {
  readonly type: "ELLIPSE"
  clone(): EllipseNode // cloned node starts off inserted into current page
  arcData: ArcData
}

interface PolygonNode extends BaseNodeMixin, BlendMixin, CornerMixin, GeometryMixin, LayoutMixin, ExportMixin {
  readonly type: "POLYGON"
  clone(): PolygonNode // cloned node starts off inserted into current page
  pointCount: number
}

interface StarNode extends BaseNodeMixin, BlendMixin, CornerMixin, GeometryMixin, LayoutMixin, ExportMixin {
  readonly type: "STAR"
  clone(): StarNode // cloned node starts off inserted into current page
  pointCount: number
  starInnerRadius: number
}

interface VectorNode extends BaseNodeMixin, BlendMixin, CornerMixin, GeometryMixin, LayoutMixin, ExportMixin {
  readonly type: "VECTOR"
  clone(): VectorNode // cloned node starts off inserted into current page
  vectorNetwork: VectorNetwork
  vectorPaths: VectorPaths
}

interface TextNode extends BaseNodeMixin, BlendMixin, GeometryMixin, LayoutMixin, ExportMixin {
  readonly type: "TEXT"
  clone(): TextNode // cloned node starts off inserted into current page
  characters: string
  fontSize: number
  fontName: FontName
  textAlignHorizontal: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED"
  textAlignVertical: "TOP" | "CENTER" | "BOTTOM"
  textDecoration: "NONE" | "UNDERLINE" | "STRIKETHROUGH"
  textAutoResize: "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT"
  letterSpacing: NumberWithUnits
  lineHeight: NumberWithUnits
  paragraphIndent: number
  paragraphSpacing: number
  textCase: "ORIGINAL" | "UPPER" | "LOWER" | "TITLE"
  autoRename: boolean
  textStyleId: string
}

interface ComponentNode extends BaseNodeMixin, BlendMixin, ChildrenMixin, FrameMixin, LayoutMixin, ExportMixin {
  readonly type: "COMPONENT"
  clone(): ComponentNode // cloned node starts off inserted into current page

  createInstance(): InstanceNode // instance starts off inserted into current page
  description: string
  readonly remote: boolean
}

interface InstanceNode extends BaseNodeMixin, BlendMixin, ChildrenMixin, FrameMixin, LayoutMixin, ExportMixin {
  readonly type: "INSTANCE"
  clone(): InstanceNode // cloned node starts off inserted into current page
  readonly masterComponent: ComponentNode
}

interface BooleanOperationNode extends BaseNodeMixin, BlendMixin, ChildrenMixin, CornerMixin, GeometryMixin, LayoutMixin, ExportMixin {
  readonly type: "BOOLEAN_OPERATION"
  clone(): BooleanOperationNode // cloned node starts off inserted into current page
  booleanOperation: "UNION" | "INTERSECT" | "SUBTRACT" | "EXCLUDE"
}

type BaseNode =
  DocumentNode |
  PageNode |
  SliceNode |
  FrameNode |
  ComponentNode |
  InstanceNode |
  BooleanOperationNode |
  VectorNode |
  StarNode |
  LineNode |
  EllipseNode |
  PolygonNode |
  RectangleNode |
  TextNode

type NodeType =
  "DOCUMENT" |
  "PAGE" |
  "SLICE" |
  "FRAME" |
  "COMPONENT" |
  "INSTANCE" |
  "BOOLEAN_OPERATION" |
  "VECTOR" |
  "STAR" |
  "LINE" |
  "ELLIPSE" |
  "POLYGON" |
  "RECTANGLE" |
  "TEXT"

////////////////////////////////////////////////////////////////////////////////
// Styles
type StyleType = "PAINT" | "TEXT" | "EFFECT" | "GRID"

interface BaseStyle {
  // The string to uniquely identify a style by
  readonly id: string
  readonly type: StyleType
  name: string // Note: setting this also sets "autoRename" to false on TextNodes
  description: string
  remote: boolean
  remove(): void
}

interface PaintStyle extends BaseStyle {
  type: "PAINT"
  paints: ReadonlyArray<Paint>
}

interface TextStyle extends BaseStyle {
  type: "TEXT"
  fontSize: number
  textDecoration: "NONE" | "UNDERLINE" | "STRIKETHROUGH"
  fontName: FontName
  letterSpacing: NumberWithUnits
  lineHeight: NumberWithUnits
  paragraphIndent: number
  paragraphSpacing: number
  textCase: "ORIGINAL" | "UPPER" | "LOWER" | "TITLE"
}

interface EffectStyle extends BaseStyle {
  type: "EFFECT"
  effects: ReadonlyArray<Paint>
}

interface GridStyle extends BaseStyle {
  type: "GRID"
  layoutGrids: ReadonlyArray<LayoutGrid>
}

////////////////////////////////////////////////////////////////////////////////
// Other

interface Image {
  // Returns a unique hash for the image
  readonly hash: string

  // The contents of the image file
  getBytesAsync(): Promise<Uint8Array>
}
