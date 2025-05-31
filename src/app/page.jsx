import React from 'react';
import Navbar from './components/Navbar';
import CreateDocumentButton from './components/CreateDocumentButton';

const page = () => {
  return (
    <div>
     <Navbar />
     {/* <TemplateCardList /> */}
     <CreateDocumentButton />
    </div>
  );
};

export default page;