import Head from "next/head";
import { gql, useQuery, useMutation } from "@apollo/client";
import { AwesomeLink } from "../components/AwesomeLink";
import type { Link as Node } from "@prisma/client";
import Link from "next/link";

const AllLinksQuery = gql`
  query allLinksQuery($first: Int, $after: ID) {
    links(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          imageUrl
          url
          title
          category
          description
          id
        }
      }
    }
  }
`;

function Home() {
  const user = true;
  const { data, loading, error, fetchMore } = useQuery(AllLinksQuery, {
    variables: { first: 3 },
  });

  // *** TODO: before performing this check, fetch the user from the decided upon authentication
  if (!user) {
    return (
      <div className="flex items-center justify-center">
        To view the awesome links you need to {/*<Link*/}
        {/*  href="/api/auth/login"*/}
        {/*  className=" block bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"*/}
        {/*>*/}
        {/*  Login*/}
        {/*</Link>*/}
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  const { endCursor, hasNextPage } = data?.links.pageInfo;

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Head>
        <title>GameDay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-auto ml-10">
          {data?.links.edges.map(({ node }: { node: Node }) => (
            <Link href={`/link/${node.id}`} key={node.id}>
              <div>
                <AwesomeLink
                  key={node.id}
                  title={node.title}
                  category={node.category}
                  url={node.url}
                  id={node.id}
                  description={node.description}
                  imageUrl={node.imageUrl}
                />
              </div>
            </Link>
          ))}
        </div>
        {hasNextPage ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded ml-10"
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                  fetchMoreResult.links.edges = [
                    ...prevResult.links.edges,
                    ...fetchMoreResult.links.edges,
                  ];
                  return fetchMoreResult;
                },
              });
            }}
          >
            more
          </button>
        ) : (
          <p className="my-10 text-center font-medium">
            You've reached the end!{" "}
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
