import { useEffect, useState } from 'react'
import { Grid, Loader } from 'semantic-ui-react'
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/Store';
import { observer } from 'mobx-react-lite';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../component/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';


export default observer( function ActivityDashboard() {
    
    //***==================== HOOKS ====================*/
    const {activityStore} = useStore();
    const {loadActivitiesAction, activityRegistry, setPagingParams, pagination} = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);
    console.log(pagination)

    function handleGetNextPageNumber(){
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivitiesAction().then(() => setLoadingNext(false));
    }

    //***==================== EFFECTS ====================*/
    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivitiesAction();
    }, [activityRegistry.size, loadActivitiesAction]);


    //Handling loading functionality when delay response
    //if(activityStore.loadingInitial && !loadingNext) return <LoadingComponent content='Loading activities...' />

    return (
        <Grid>
            <Grid.Column width="10">
                {activityStore.loadingInitial && activityRegistry.size === 0 && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNextPageNumber}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}
            </Grid.Column>
            <Grid.Column width="6">
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})
