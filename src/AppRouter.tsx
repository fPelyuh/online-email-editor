import React, { FunctionComponent, useEffect } from 'react';
import { Route, Switch } from 'react-router';
import routes from './constants/routes';
import NotFoundPage from './pages/notFoundPage/NotFoundPage';
import { templatesListLoader } from './reducers/templates';
import { useDispatch } from 'react-redux';

const AppRouter: FunctionComponent = () => {
    const dispatch = useDispatch();
    const JSONFromLocalStorage = localStorage.getItem('templates');

    const data = JSON.parse(JSONFromLocalStorage ?? '');

    useEffect(() => {
        if (!data) {
            return;
        }
        dispatch(templatesListLoader(data));
    }, [data, dispatch]);

    return (
        <Switch>
            {routes.map(({ path, component: Component }) => {
                return (
                    <Route key={path} path={path} exact>
                        <Component />
                    </Route>
                );
            })}
            <Route component={NotFoundPage} />
        </Switch>
    );
};

export default AppRouter;
