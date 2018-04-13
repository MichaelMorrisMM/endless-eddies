# TurboGenC++ Usage
command line args for the TurboGenC++ executable

Switch | Description | Type | Default
------ | ----------- | ---- | -------
-h | display the help message | |
-n | number of grid points | int (n % 2 == 0 AND n >= 16) | 32
-m | number of modes | int | 100
-l | box size | float | 9 * 2 * pi/100
-o | enable file output | `ascii` OR `bin` | none
-spec | which spectrum to use | `cbc` OR `karman` OR `kcm` OR `file` | cbc
-ke | peak wave number of karman spectrum | float | 40
-urms | RMS velocity for karman spectrum | float | 0.25
-nu | viscosity for karman spectrum | float | 1e-5
-fname | optional, append to filenames | string | ''
-dir | directory to save output files | string | .
-d | make the output deterministic | on/off | off

# turbulance.utah.edu - Defaults
the current default values for turbulance.utah.edu
#### Server limits
- 16 <= n <= 128
- ?? <= m <= 5000

### Common Default Parameters
- Deterministic: True
- Post-processing: True
- Number of Modes: 100
- Grid Resolution: 32 -n

### Comte-Bellot Corrsin | cbc
- Box Size: 0.5654867
- command: `TurboGenC++.exe -n 32 -m 100 -l 0.5654867 -d -o ascii -o bin -spec cbc -ke 40.0 -urms 0.25 -nu 1e-05 -dir tmp/ -specfname none`

### von Karman - Pao | karman
- Box Size: 0.5654867
- Viscosity: 0.0001
- ke: 40
- urms: 0.25
- command: `TurboGenC++.exe -n 32 -m 100 -l 0.5654867 -d -o ascii -o bin -spec karman -ke 40.0 -urms 0.25 -nu 1e-05 -dir tmp/ -specfname none`

### Kang-Chester-Meneveau | kcm
- Box Size: 6.2831853
- command: `TurboGenC++.exe -n 32 -m 100 -l 6.2831853 -d -o ascii -o bin -spec kcm -ke 40.0 -urms 0.25 -nu 1e-05 -dir tmp/ -specfname none`

### XY Data | xy
- Box Size: 0.5654867
- Spectrum Data: `INPUT_FILE_NAME`
- command: `TurboGenC++.exe -n 32 -m 100 -l 0.5654867 -d -o ascii -o bin -spec file -ke 40.0 -urms 0.25 -nu 1e-05 -dir tmp/ -specfname INPUT_FILE_NAME`
