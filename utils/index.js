import { useEffect, useState } from "react";

export const usePageLoading = (val = false) => {
    // Initialize the loading state with the provided value or false by default.
    const [load, setLoad] = useState(val);

    // useEffect is used to update the loading state when the input value (val) changes.
    useEffect(() => {
        setLoad(val);
    }, [val]);

    // Return the current loading state.
    return load;
};