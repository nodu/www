help:
	cat Makefile

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
