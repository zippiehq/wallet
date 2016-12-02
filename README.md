# Zipper Wallet

Zipper Wallet utilizes the [Zipper Vault] (https://github.com/zipperglobal/vault)
digital identity framework, to create a useable wallet for Zipper enabled ERC20
compatible contracts hosted in the Ethereum blockchain.


# Installation and Building

~~~~
$ git clone https://github.com/zipperglobal/wallet
$ cd wallet
$ npm install
$ cp -R public build
$ npm run build
~~~~

Once built, you can open the index.html file under the build/ directory in a
web browser (currently only Chrome is tested) to run the application.


# Developing

In the checked out sources for the wallet, if you run:

~~~~
$ npm install
$ npm start
~~~~

Will start the development server which automatically rebuilds and updates
the app running in your browser. By default the app is accessible through:
[http://localhost:3000/]


# Contributions

Contributions to Zipper Wallet require accepting a Contributor License Agreement,
see more here: [Zipper Contribution] (https://contribute.zipperglobal.com/)

