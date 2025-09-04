help:
	cat Makefile

setup:
	yarn install
	yarn build

ls:
	vercel ls

dev:
	yarn dev

debug:
	yarn debug

build:
	yarn build

deployments:
	xdg-open "https://vercel.com/nodu/www/deployments"
