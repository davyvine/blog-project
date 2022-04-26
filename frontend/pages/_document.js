import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
   render () {
      return (
         <Html lang="en">
            <Head> 
            <meta charSet="UTF-8"/>
               <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
               {/* add bootstrap link here */}
                  {/* navigation bar */}
                  <link 
                     rel="stylesheet"
                     href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css"
                  />
                  {/* progress bar */}
                  <link
                     rel="stylesheet"
                     href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
                  />
                  {/* styling or css */}
                  <link
                     rel="stylesheet"
                     href="/static/css/styles.css"
                  />

                  <link href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900" rel="stylesheet"/>
                  <link rel="stylesheet" href="%PUBLIC_URL%/icon-font.css" />
                  
            </Head>
            <body>
               <Main />
               <NextScript />
            </body>
         </Html>
      )
   }
}

export default MyDocument;