# Halo-CE-Maps
A repository for download any map of the game Halo Custom Edition of automatic way when enter to any server to a custom map.

## Requeriments
- [Chimera](https://github.com/SnowyMouse/chimera)

## Installation
Just we have locate the file `chimera.ini` in the Halo Custom Edition folder (yes, where is the haloce.exe file), and nav to the section `[memory]` and finally add next line:

```ini
download_template=http://maps.haloce.net/{map}
```

after added that command the file will be showing like this:

```ini
[memory]
;enable_map_memory_buffer=1
map_size=1024
;benchmark=1
download_font=small

;download_template=http://maps{mirror<2,1>}.halonet.net/halonet/locator.php?format=inv&map={map}&type={game}
;download_retail_maps=1

download_template=http://maps.haloce.net/{map}
```
> Obviously I'm ignoring the most comments irrelevant
