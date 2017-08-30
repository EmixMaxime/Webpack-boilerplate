const path = require('path')

const publicAssets = path.resolve(__dirname, '../../../public/assets')

module.exports = {
  entry: {
    main: ['./resources/assets/js/main/main.js']
  },
  vendor: ['vue'],
  port: 3003, // Port du serveur qui délivre les assets
  html: false,
  browsers: ['last 2 versions', 'ie > 8'],
  // = public path
  assets_url: '/assets/',  // Urls dans le fichier final attention au / à la fin pour la génération du fichier assets.json !!
  assets_path: publicAssets, // ou build ? : Attention -> obligation de mettre le / à  la fin
  stylelint: './css/**/*.scss',
  refresh: ['./resources/views/**/*.twig'], // Permet de forcer le rafraichissement du navigateur lors de la modification de ces fichiers
  historyApiFallback: false // Passer à true si on utilise le mode: 'history' de vue-router (redirige toutes les requêtes sans réponse vers index.html)
}
