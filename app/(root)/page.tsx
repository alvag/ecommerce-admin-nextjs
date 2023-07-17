import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface HomeProps {}

const HomePage: FC<HomeProps> = ({}) => {
    return (
        <div>
            <Button>Click Me</Button>
        </div>
    );
};

export default HomePage;
