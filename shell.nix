let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-25.05";
  pkgs = import nixpkgs { config = { }; overlays = [ ]; };
in

pkgs.mkShell {
  packages = with pkgs; [
    gnumake
    git
    nodejs_22
    yarn
    nodePackages_latest.vercel
  ];


  GIT_EDITOR = "${pkgs.neovim}/bin/nvim";

  shellHook = ''
    git status
  '';
}
