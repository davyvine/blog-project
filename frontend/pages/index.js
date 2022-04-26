import Layout from '../components/layout/Layout';
import Link from 'next/link';
import Main from '../components/main/Main';
import Header from '../components/header/Header';
import '../static/sass/main.scss';

const Index = () => {
   return (
      <Layout>
         {/* child components */}
            <Header />
            <Main />
      </Layout>
   )
}

export default Index;