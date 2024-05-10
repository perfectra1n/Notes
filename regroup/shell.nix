
{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
  name = "electron-env";
  targetPkgs = pkgs: (with pkgs;
    [
      nodejs python libcxx systemd libpulseaudio libdrm mesa stdenv.cc.cc
      alsa-lib atk at-spi2-atk at-spi2-core cairo cups dbus expat fontconfig
      freetype gdk-pixbuf glib gtk3 libnotify libuuid nspr nss pango systemd
      libappindicator-gtk3 libdbusmenu libxkbcommon
    ]
  ) ++ (with pkgs.xorg;
    [
      libXScrnSaver libXrender libXcursor libXdamage libXext libXfixes libXi
      libXrandr libX11 libXcomposite libxshmfence libXtst libxcb
    ]
  );
}).env
