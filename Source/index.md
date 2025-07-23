# Geometry Nodes Overview

<sub>Version |version| (Status as of |today|)</sub>

Here you can find a complete (compact) list of *Geometry Nodes* available in different Blender versions in tabular form.

> Since here unfortunately a restriction of the number of characters is set to 30000, it was not possible for me to add the links to the respective documentation.
>
> Therefore I have additionally published this list in HTML format, which contains further links directly to the respective documentation of the individual nodes:<br>[Geometry Nodes Overview][geometry-nodes-overview]

The grouping of nodes and their assignment to submenus has changed several times from version to version and has only stabilized somewhat with version 3.5. The grouping of nodes used here therefore follows the current structure in Blender 4.5.

## Attribute Nodes

[table:attribute]

**Additional changes since version 3.4:**
- The `Transfer Attribute` node has been removed and split into multiple more specific nodes:
  - The `Sample Index` node retrieves data from specific geometry elements by index.
  - The `Sample Nearest` node retrieves the indices from the closest geometry elements
  - The `Sample Nearest Surface` node interpolates a field input to the closest location on a mesh surface.

  On that topic, check out this post explaining how to use the new nodes: [Where is Transfer attribute in 3.4?][bse-276088]

**Additional changes since version 3.5:**
- The `Store Named Attribute` node can now store 2D vector attributes

### Addendum: Replaced Attribute Nodes

Some nodes were completely replaced by other nodes after version *2.93* due to the introduction of [Fields][fields]:

[table:attribute/addendum]

## Input Nodes

### Input Nodes - Constant

[table:input/constant]

### Input Nodes - Gizmo

[table:input/gizmo]

### Input Nodes - Import

[table:input/import]

### Input Nodes - Scene

[table:input/scene]

## Output Nodes

[table:output]

## Geometry Nodes

[table:geometry]

### Geometry Nodes - Read

[table:geometry/read]

**Additional changes since version 3.5:**
- The `Named Attribute` input node now has an "Exists" output to tell whether the attribute exists

### Geometry Nodes - Sample

[table:geometry/sample]

### Geometry Nodes - Write

[table:geometry/write]

### Geometry Nodes - Operations

[table:geometry/operations]

## Curve Nodes

### Curve Nodes - Read

[table:curve/read]

### Curve Nodes - Sample

[table:curve/sample]

### Curve Nodes - Write

[table:curve/write]

### Curve Nodes - Operations

[table:curve/operations]

**Additional changes since version 3.5:**
- The `Trim Curves` node now has a selection input

### Curve Nodes - Primitives

[table:curve/primitives]

### Curve Nodes - Topology

[table:curve/topology]

## Grease Pencil Nodes

### Grease Pencil Nodes - Read

[table:grease_pencil/read]

### Grease Pencil Nodes - Write

[table:grease_pencil/write]

### Grease Pencil Nodes - Operations

[table:grease_pencil/operations]

## Instances Nodes

[table:instances]

## Mesh Nodes

### Mesh Nodes - Read

[table:mesh/read]

### Mesh Nodes - Sample

[table:mesh/sample]

### Mesh Nodes - Write

[table:mesh/write]

### Mesh Nodes - Operations

[table:mesh/operations]

### Mesh Nodes - Primitives

[table:mesh/primitives]

### Mesh Nodes - Topology

[table:mesh/topology]

### Mesh Nodes - UV

[table:mesh/uv]

## Point Nodes

[table:point]

### Addendum: Replaced Point Nodes

Some nodes were completely replaced by other nodes after version *2.93*:

[table:point_addendum]

<sub>* The node `Align Rotation to Vector` was replaced by `Align Euler to Vector` in version *3.0*, but a node with the same name has been added in version *4.2*. Although it has the same name, it performs a different function!</sub>

## Volume Nodes

[table:volume]

## Simulation Nodes

[table:simulation]

## Material Nodes

[table:material]

## Texture Nodes

[table:texture]

**Additional changes since version 3.5:**
- The `Image Texture` node has a new mirror extension type

## Utilities Nodes

[table:utilities]

### Utilities Nodes - Color

[table:utilities/color]

<sub>* The nodes `MixRGB` and `Mix Color` are referred to as "Mix" in the title of the node.</sub>

### Utilities Nodes - Text

[table:utilities/text]

### Utilities Nodes - Vector

[table:utilities/vector]

### Utilities Nodes - Field

[table:utilities/field]

### Utilities Nodes - Math

[table:utilities/math]

### Utilities Nodes - Matrix

[table:utilities/matrix]

### Utilities Nodes - Rotation

[table:utilities/rotation]

<sub>¹ The nodes *Rotate Euler* and *Align Euler to Vector* are still included in version 4.2+, but are marked as "Deprecated" and should no longer be used.</sub>

## Group Nodes

[table:group]

## Hair Nodes

> These nodes are node group assets that are included in the bundled ["Essentials" asset library.][essentials_asset_library]

### Hair Nodes - Deformation

[table:hair/deformation]

### Hair Nodes - Generation

[table:hair/generation]

### Hair Nodes - Guides

[table:hair/guides]

### Hair Nodes - Read

[table:hair/read]

### Hair Nodes - Utility

[table:hair/utility]

### Hair Nodes - Write

[table:hair/write]

## Normals

[table:normals]

> The node `Smooth by Angle` is a node group asset that is included in the bundled ["Essentials" asset library.][essentials_asset_library]

## Math Nodes

Most mathematical operations hide behind the nodes [Math][math] and [Vector Math][vector_math], which can be found in the category **Utilities** and **Vector** respectively.

So if you see a node that does not appear with its name in the above list, it is almost certainly one of these two nodes whose property has been set to a specific mathematical operation, and thus also shows the corresponding name in the title.

### Vector Math Nodes

The operations available in [Vector Math][vector_math] are:

[table:vector_math]

### Math Nodes

The operations available in [Math][math] are as follows (these are equally available in all versions):

| | All Versions |
|:---|:---|
| **Functions:** | |
| | Add |
| | Subtract |
| | Multiply |
| | Divide |
| | Multiply Add |
| | Power |
| | Logarithm |
| | Square Root |
| | Inverse Square Root |
| | Absolute |
| | Exponent |
| **Comparison:** | |
| | Maximum |
| | Less Than |
| | Greater Than |
| | Sign |
| | Compare |
| | Smooth Minimum |
| | Smooth Maximum |
| **Rounding:** | |
| | Round |
| | Floor |
| | Ceil |
| | Truncate |
| | Fraction |
| | Modulo * |
| | Wrap |
| | Snap |
| | Ping-Pong |
| **Trigonometric:** | |
| | Sine |
| | Cosine |
| | Tangent |
| | Arcsine |
| | Arccosine |
| | Arctangent |
| | Arctan2 |
| | Hyperbolic Sine |
| | Hyperbolic Cosine |
| | Hyperbolic Tangent |
| **Conversion:** | |
| | To Radians |
| | To Degrees |
| | Clamp |

In Blender version 4.0, the *Modulo* node has been split into two options:
  - *Truncated Modulo* : Outputs the remainder once the first value is divided by the second value.
  - *Floored Modulo*: Returns the positive remainder of a division operation.

---

…and if you still see a node somewhere in a screenshot/tutorial that is not listed here, then it is most likely an individually assigned title…

---

> **…A personal addition…**
>
> This list has been put together over many years by [quellenform][quellenform-user] and is updated from time to time.
>
> If you have any suggestions for improvements or changes, feel free to suggest them on [GitHub][quellenform-github].


  [geometry-nodes-overview]: https://geometry-nodes-overview.docs.quellenform.at/
  [math]: https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/utilities/math/math.html
  [vector_math]: https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/utilities/vector/vector_math.html
  [fields]: https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/fields.html
  [essentials_asset_library]: https://docs.blender.org/manual/en/latest/files/asset_libraries/introduction.html#assets-bundled
  [bse-276088]: https://blender.stackexchange.com/a/276088/145249
  [quellenform-user]: https://blender.stackexchange.com/users/145249/quellenform
  [quellenform-github]: https://github.com/quellenform/blender-geometry-nodes-overview/
