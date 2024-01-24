let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-23.11";
  pkgs = import nixpkgs { config = { }; overlays = [ ]; };
in

pkgs.mkShell {
  packages = with pkgs; [
    gnumake
    git
    nodejs-18_x
    yarn
    nodePackages_latest.vercel

  ];


  GIT_EDITOR = "${pkgs.neovim}/bin/nvim";

  shellHook = ''
    git status
  '';
}
