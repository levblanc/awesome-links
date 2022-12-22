import {
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
  query {
    links {
      id
      title
      url
      description
      imageUrl
      category
    }
  }
`;

function Home() {
  const { data, error, loading } = useQuery(AllLinksQuery);

  console.log('data', data);
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
        <>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          {data &&
            data.links.length &&
            data.links.map((item, index: number) => {
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
                    <Image src={item.imageUrl} height={240} alt={item.title} />
                  </Card.Section>
                  <Group position='apart' mt='md' mb='xs'>
                    <Text weight={500}>{item.title}</Text>
                    <Badge color='pink' variant='light'>
                      {item.category}
                    </Badge>
                  </Group>
                  <Text size='sm' color='dimmed'>
                    {item.description}
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
        </>
      )}
    </>
  );
}

export default Home;
