import _ from 'underscore';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Item {
  description?: string;
  image?: string;
  imageAlt?: string;
  title: string,
  url: string
}

interface Props {
  items: Array<Item>
}

const Carousel = (props: Props) => {
  return (
    <div
      className='px-10 py-16 md:p-24'
    >
      <Swiper
        autoHeight
        className='flex items-center'
        breakpoints={{
          480: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
        }}
        loop
        modules={[Pagination]}
        pagination={{
          clickable: true
        }}
      >
        { _.map(props.items, (item, index) => (
          <SwiperSlide
            href={item.url}
            key={index}
            tag='a'
          >
            <img
              alt={item.imageAlt}
              className='w-full h-[260px] object-cover rounded-t-md'
              src={item.image}
            />
            <div
              className='bg-primary text-white p-6 rounded-b-md h-[168px]'
            >
              <h2
                className='text-2xl font-bold uppercase'
              >
                { item.title }
              </h2>
              <p
                className='mt-4 line-clamp-3'
              >
                { item.description }
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;