import React from 'react';
import Image from 'next/image'

const Footer = () => (
  <div id="footer-0" className="bg-light p-0 text-center flex-col items-center justify-center">
    {/* <div className="logo1 " /> */}

    <div className='w-full flex items-center justify-center'>
            <Image
              src="/logo0.png"
              width={150}
              height={120}
              alt="Picture of the author"
            />
          </div>
    <p data-testid="footer-text mt-9">
      Powered by <a href="https://towingroadsidehouston.com">Towing Houston Roadside</a>
    </p>
  </div>
);

export default Footer;
