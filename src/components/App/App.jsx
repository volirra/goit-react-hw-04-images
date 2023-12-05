import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import Loader from 'components/Loader';
import ButtonLoadMore from 'components/Button';
import { ToastWrapper } from 'components/ToastContainer/ToastContainer';

import { fetchImages } from 'service/fetchImages';
import { StyledApp } from './App.styled';

function App() {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [status, setStatus] = useState('idle');
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!query) {
      return;
    }
    async function addImages() {
      setStatus('pending');

      try {
        const { images, totalImages } = await fetchImages(query, page);

        if (images.length === 0) {
          setNotification({
            type: 'error',
            message:
              'Sorry, there are no images matching your search query. Please try again.',
          });
        }
        if (images.length !== 0 && page === 1) {
          setNotification({
            type: 'success',
            message: `Hooray! We found ${totalImages} images.`,
          });
        }

        setPhotos(prevState => [...prevState, ...images]);
        setStatus('resolved');
        setTotalImages(totalImages);
      } catch (error) {
        console.log(error.message);
        setNotification({
          type: 'error',
          message: 'There are some problems! Try again later.',
        });
        setStatus('rejected');
      }
    }
    addImages();
  }, [query, page]);

  useEffect(() => {
    if (notification) {
      function handleNotification() {
        const notificationType = notification.type;
        const notificationMessage = notification.message;

        if (notificationType === 'info') {
          toast.info(notificationMessage);
          setNotification({ type: '', message: '' });
        }
        if (notificationType === 'error') {
          toast.error(notificationMessage);
          setNotification({ type: '', message: '' });
        }
        if (notificationType === 'success') {
          toast.success(notificationMessage);
          setNotification({ type: '', message: '' });
        }
      }
      handleNotification();
    }
  }, [notification]);

  const handleSearch = value => {
    if (!value) {
      setNotification({
        type: 'info',
        message: 'Please enter your search query!',
      });
      return;
    }

    if (value === query) {
      setNotification({
        type: 'info',
        message:
          'You are seeing the images by this query. Please, change your query.',
      });
      return;
    }

    setQuery(value);
    setPhotos([]);
    setPage(1);
    setNotification({
      type: '',
      message: '',
    });
    setStatus('idle');
  };

  const onLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <StyledApp>
      <Searchbar onSubmit={handleSearch} />

      {status === 'pending' && <Loader />}

      {(status === 'resolved' || (status === 'pending' && page !== 1)) && (
        <ImageGallery images={photos} />
      )}

      {((totalImages !== photos.length && status === 'resolved') ||
        (status === 'pending' && page > 1)) && (
        <ButtonLoadMore onClick={onLoadMore} />
      )}

      <ToastWrapper />
    </StyledApp>
  );
}

export default App;
