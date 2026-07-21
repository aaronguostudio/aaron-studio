# Programmed Visual Atlas — research notes

This is an original, dependency-free visual prototype. It does not use generated
images, source imagery, copied component code, or provider audio.

## Reference research

- [React Bits component index](https://reactbits.dev/get-started/index): used as
  a survey of the breadth of contemporary React/WebGL background primitives
  (Ferrofluid, Liquid Ether, Threads, Dither, Prism, Glass), not as an asset or
  code source.
- [Three.js `ShaderMaterial` documentation](https://threejs.org/docs/pages/ShaderMaterial.html):
  informed the fullscreen material-field direction and the long-term path to a
  production shader implementation.
- [Three.js GPGPU examples](https://threejs.org/examples/?q=gpgpu): informed
  the particle-flow and future GPU-simulation directions.
- [Codrops generative art](https://tympanus.net/codrops/tag/generative-art/)
  and its [reaction-diffusion compute-shader study](https://tympanus.net/codrops/2024/05/01/reaction-diffusion-compute-shader-in-webgpu/):
  informed the use of constrained systems and reaction-diffusion as a material,
  not as a decorative visualizer.

## Selection guardrails

- No automatic beat-to-position, beat-to-scale, or shake mapping.
- A future rendered variant should replace wall-clock time with deterministic
  frame time and map audio only to material properties such as viscosity,
  highlight, refraction, density, or color temperature.
- Each study must remain visually legible when static; interaction is a layer of
  depth, not a requirement for the composition to make sense.
