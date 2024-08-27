module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      targets: {
        esmodules: true, // ESモジュールの環境をターゲット
        // 必要に応じて他のターゲットも追加可能です
      },
      useBuiltIns: 'usage', // 必要に応じてポリフィルを自動的に追加
      corejs: 3, // コアJSのバージョンを指定
    }]
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import' // 動的インポートのサポート
  ]
}
