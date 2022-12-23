import {
  Box,
  Button,
  LoadingOverlay,
  Alert,
  Card,
  Image,
  Text,
  Group,
  Badge,
} from '@mantine/core';
import { gql, useQuery } from '@apollo/client';
import { IconAlertCircle } from '@tabler/icons';

const AllLinksQuery = gql`
  query allLinksQuery($first: Int, $after: String) {
    links(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          title
          url
          description
          imageUrl
          category
        }
      }
    }
  }
`;

function Home() {
  const { data, error, loading, fetchMore } = useQuery(AllLinksQuery, {
    variables: { first: 2 },
  });

  const loadNextPage = () => {
    console.log('loading next page...');
    fetchMore({
      variables: {
        after: data?.links.pageInfo.endCursor,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        fetchMoreResult.links.edges = [
          ...prevResult.links.edges,
          ...fetchMoreResult.links.edges,
        ];

        console.log(fetchMoreResult);
        return fetchMoreResult;
      },
    });
  };

  return (
    <>
      {error ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title='Error Occured!'
          color='red'
        >
          {error.message}
        </Alert>
      ) : (
        <Box sx={{ padding: 20 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContents: 'space-between',
            }}
          >
            <LoadingOverlay visible={loading} overlayBlur={2} />
            {data?.links.edges.map(({ node }, index: number) => {
              return (
                <Card
                  sx={{ width: 320, margin: 10 }}
                  shadow='sm'
                  p='lg'
                  radius='md'
                  withBorder
                  key={index}
                >
                  <Card.Section>
                    <Image src={node.imageUrl} height={240} alt={node.title} />
                  </Card.Section>
                  <Group position='apart' mt='md' mb='xs'>
                    <Text weight={500}>{node.title}</Text>
                    <Badge color='pink' variant='light'>
                      {node.category}
                    </Badge>
                  </Group>
                  <Text size='sm' color='dimmed'>
                    {node.description}
                  </Text>
                  <Button
                    variant='light'
                    color='blue'
                    fullWidth
                    mt='md'
                    radius='md'
                  >
                    Bookmark
                  </Button>
                </Card>
              );
            })}
          </Box>

          <Box sx={{ padding: 20, textAlign: 'center' }}>
            {data?.links.pageInfo.hasNextPage ? (
              <Button onClick={loadNextPage}>More</Button>
            ) : (
              <Text color='dimmed'>You've reached the end.</Text>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}

export default Home;
