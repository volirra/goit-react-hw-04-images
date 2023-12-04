import { TailSpin } from 'react-loader-spinner';

import { StyledLoader } from './Loader.styled';

const Loader = () => {
  return (
    <StyledLoader>
      <TailSpin color="#131ad6" />
    </StyledLoader>
  );
};

export default Loader;
