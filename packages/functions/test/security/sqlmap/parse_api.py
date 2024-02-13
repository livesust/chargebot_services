from openapi_parser import parse
import re

def transform_url(url):
    # Define the regular expression pattern to match parameters inside curly braces
    pattern = re.compile(r'{([^}]*)}')

    # Replace each parameter with its index followed by '*'
    def replace_param(match):
        return str(parameter_indices[match.group(1)]) + '*'

    # Extract parameter names and their indices
    parameter_indices = {}
    parameters = pattern.findall(url)
    for i, param in enumerate(parameters, start=1):
        parameter_indices[param] = i

    # Replace parameters in the URL
    transformed_url = pattern.sub(replace_param, url)

    return transformed_url

def write_transformed_urls_to_file(urls, output_file):
    with open(output_file, 'w') as file:
        for url in urls:
            transformed_url = transform_url(url)
            file.write(transformed_url + '\n')

specification = parse('api_oas30.json')

for server in specification.servers:
  urls = [server.url]
  urls.extend([f"{server.url}{transform_url(x.url)}" for x in specification.paths])
  print("\nEndpoints")
  print(urls)
  write_transformed_urls_to_file(urls, "targets.info")

# Output
#
# >> Application servers
# >> production - https://users.app
# >> staging - http://stage.users.app
# >> development - http://users.local