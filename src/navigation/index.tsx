import React, {
    Suspense,
    lazy,
} from "react";

const NavigatorLazy = lazy(() => import('./Stacks/Navigator'));

const RootNavigation = () => {

    return (
        <Suspense>
            <NavigatorLazy />
        </Suspense>
    )
};

export default RootNavigation;