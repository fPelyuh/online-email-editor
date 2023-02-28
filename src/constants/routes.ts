import AppRoute from './AppRoute';
import Editor from '../pages/Editor/Editor';
import HomePage from '../pages/HomePage/HomePage';
import { RouteProps } from 'react-router';

type ExtendedRouteProps = RouteProps & {
    path: string;
    component: any;
};

const routes: ExtendedRouteProps[] = [
    {
        path: AppRoute.ROOT,
        component: HomePage
    },
    {
        path: AppRoute.TEMPLATE,
        component: Editor
    }
];

export default routes;
