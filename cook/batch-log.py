import csv
from datetime import datetime

def parse_log_to_csv(input_text, output_file):
    # Initialize list to store parsed data
    parsed_data = []
    
    # Process each line
    for line in input_text.split('\n'):
        if line.strip():  # Skip empty lines
            # Split the line into timestamp and rest
            parts = line.split(' - Status: ')
            if len(parts) == 2:
                timestamp_str = parts[0]
                status_progress = parts[1]
                
                # Parse timestamp
                timestamp = datetime.strptime(timestamp_str, '%Y-%m-%dT%H:%M:%S.%fZ')
                
                # Split status and progress
                status_parts = status_progress.split(' - ')
                status = status_parts[0]
                progress = status_parts[1] if len(status_parts) > 1 else "0/0"
                
                # Calculate progress percentage
                current, total = map(int, progress.split('/'))
                percentage = (current / total * 100) if total > 0 else 0
                
                # Add to parsed data
                parsed_data.append([
                    timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                    status,
                    current,
                    total,
                    f"{percentage:.2f}%"
                ])
    
    # Write to CSV
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        # Write header
        writer.writerow(['Timestamp', 'Status', 'Current', 'Total', 'Progress'])
        # Write data
        writer.writerows(parsed_data)

# Example usage
log_data = """
2025-02-21T02:48:03.955Z - Status: validating - 0/0
2025-02-21T02:48:09.157Z - Status: in_progress - 3/97
2025-02-21T02:48:14.397Z - Status: in_progress - 6/97
2025-02-21T02:48:19.619Z - Status: in_progress - 10/97
2025-02-21T02:48:24.841Z - Status: in_progress - 13/97
2025-02-21T02:48:30.274Z - Status: in_progress - 20/97
2025-02-21T02:48:35.643Z - Status: in_progress - 30/97
2025-02-21T02:48:40.918Z - Status: in_progress - 35/97
2025-02-21T02:48:46.148Z - Status: in_progress - 41/97
2025-02-21T02:48:51.469Z - Status: in_progress - 47/97
2025-02-21T02:48:56.688Z - Status: in_progress - 47/97
2025-02-21T02:49:01.937Z - Status: in_progress - 59/97
2025-02-21T02:49:07.236Z - Status: in_progress - 59/97
2025-02-21T02:49:12.458Z - Status: in_progress - 60/97
2025-02-21T02:49:17.686Z - Status: in_progress - 60/97
2025-02-21T02:49:22.888Z - Status: in_progress - 60/97
2025-02-21T02:49:28.127Z - Status: in_progress - 60/97
2025-02-21T02:49:33.357Z - Status: in_progress - 60/97
2025-02-21T02:49:38.617Z - Status: in_progress - 64/97
2025-02-21T02:49:43.916Z - Status: in_progress - 64/97
2025-02-21T02:49:49.223Z - Status: in_progress - 64/97
2025-02-21T02:49:54.446Z - Status: in_progress - 69/97
2025-02-21T02:49:59.666Z - Status: in_progress - 69/97
2025-02-21T02:50:05.013Z - Status: in_progress - 70/97
2025-02-21T02:50:10.320Z - Status: in_progress - 75/97
2025-02-21T02:50:15.644Z - Status: in_progress - 76/97
2025-02-21T02:50:20.863Z - Status: in_progress - 76/97
2025-02-21T02:50:26.098Z - Status: in_progress - 77/97
2025-02-21T02:50:31.411Z - Status: in_progress - 78/97
2025-02-21T02:50:36.636Z - Status: in_progress - 80/97
2025-02-21T02:50:42.376Z - Status: in_progress - 80/97
2025-02-21T02:50:47.571Z - Status: in_progress - 81/97
2025-02-21T02:50:52.849Z - Status: in_progress - 81/97
2025-02-21T02:50:58.138Z - Status: in_progress - 81/97
2025-02-21T02:51:03.360Z - Status: in_progress - 83/97
2025-02-21T02:51:08.851Z - Status: in_progress - 83/97
2025-02-21T02:51:14.216Z - Status: in_progress - 83/97
2025-02-21T02:51:19.423Z - Status: in_progress - 84/97
2025-02-21T02:51:24.870Z - Status: in_progress - 84/97
2025-02-21T02:51:30.088Z - Status: in_progress - 84/97
2025-02-21T02:51:35.424Z - Status: in_progress - 84/97
2025-02-21T02:51:40.740Z - Status: in_progress - 87/97
2025-02-21T02:51:46.035Z - Status: in_progress - 87/97
2025-02-21T02:51:51.285Z - Status: in_progress - 87/97
2025-02-21T02:51:56.509Z - Status: in_progress - 87/97
2025-02-21T02:52:01.835Z - Status: in_progress - 87/97
2025-02-21T02:52:07.060Z - Status: in_progress - 87/97
2025-02-21T02:52:12.278Z - Status: in_progress - 87/97
2025-02-21T02:52:17.633Z - Status: in_progress - 87/97
2025-02-21T02:52:22.929Z - Status: in_progress - 87/97
2025-02-21T02:52:28.263Z - Status: in_progress - 87/97
2025-02-21T02:52:33.466Z - Status: in_progress - 87/97
2025-02-21T02:52:38.703Z - Status: in_progress - 87/97
2025-02-21T02:52:44.022Z - Status: in_progress - 87/97
2025-02-21T02:52:49.253Z - Status: in_progress - 87/97
2025-02-21T02:52:54.780Z - Status: in_progress - 87/97
2025-02-21T02:53:00.100Z - Status: in_progress - 87/97
2025-02-21T02:53:05.324Z - Status: in_progress - 87/97
2025-02-21T02:53:10.521Z - Status: in_progress - 87/97
2025-02-21T02:53:15.957Z - Status: in_progress - 87/97
2025-02-21T02:53:21.308Z - Status: in_progress - 87/97
2025-02-21T02:53:26.520Z - Status: in_progress - 87/97
2025-02-21T02:53:32.054Z - Status: in_progress - 87/97
2025-02-21T02:53:37.377Z - Status: in_progress - 87/97
2025-02-21T02:53:42.601Z - Status: in_progress - 87/97
2025-02-21T02:53:47.935Z - Status: in_progress - 91/97
2025-02-21T02:53:53.245Z - Status: in_progress - 91/97
2025-02-21T02:53:58.485Z - Status: in_progress - 91/97
2025-02-21T02:54:03.738Z - Status: in_progress - 91/97
2025-02-21T02:54:09.016Z - Status: in_progress - 91/97
2025-02-21T02:54:14.242Z - Status: in_progress - 91/97
2025-02-21T02:54:19.565Z - Status: in_progress - 91/97
2025-02-21T02:54:24.890Z - Status: in_progress - 91/97
2025-02-21T02:54:30.129Z - Status: in_progress - 91/97
2025-02-21T02:54:35.324Z - Status: in_progress - 91/97
2025-02-21T02:54:40.556Z - Status: in_progress - 91/97
2025-02-21T02:54:45.990Z - Status: in_progress - 91/97
2025-02-21T02:54:51.333Z - Status: in_progress - 91/97
2025-02-21T02:54:56.561Z - Status: in_progress - 91/97
2025-02-21T02:55:01.857Z - Status: in_progress - 91/97
2025-02-21T02:55:07.080Z - Status: in_progress - 91/97
2025-02-21T02:55:12.411Z - Status: in_progress - 91/97
2025-02-21T02:55:17.757Z - Status: in_progress - 91/97
2025-02-21T02:55:22.969Z - Status: in_progress - 91/97
2025-02-21T02:55:28.277Z - Status: in_progress - 91/97
2025-02-21T02:55:33.644Z - Status: in_progress - 91/97
2025-02-21T02:55:38.929Z - Status: in_progress - 91/97
2025-02-21T02:55:44.140Z - Status: in_progress - 91/97
2025-02-21T02:55:49.379Z - Status: in_progress - 91/97
2025-02-21T02:55:54.696Z - Status: in_progress - 91/97
2025-02-21T02:55:59.935Z - Status: in_progress - 91/97
2025-02-21T02:56:05.247Z - Status: in_progress - 91/97
2025-02-21T02:56:10.569Z - Status: in_progress - 91/97
2025-02-21T02:56:15.790Z - Status: in_progress - 91/97
2025-02-21T02:56:21.014Z - Status: in_progress - 91/97
2025-02-21T02:56:26.282Z - Status: in_progress - 91/97
2025-02-21T02:56:31.567Z - Status: in_progress - 91/97
2025-02-21T02:56:36.892Z - Status: in_progress - 91/97
2025-02-21T02:56:42.338Z - Status: in_progress - 91/97
2025-02-21T02:56:47.553Z - Status: in_progress - 92/97
2025-02-21T02:56:52.861Z - Status: in_progress - 92/97
2025-02-21T02:56:58.062Z - Status: in_progress - 92/97
2025-02-21T02:57:03.306Z - Status: in_progress - 92/97
2025-02-21T02:57:08.585Z - Status: in_progress - 92/97
2025-02-21T02:57:13.785Z - Status: in_progress - 92/97
2025-02-21T02:57:19.017Z - Status: in_progress - 92/97
2025-02-21T02:57:24.505Z - Status: in_progress - 93/97
2025-02-21T02:57:29.834Z - Status: in_progress - 93/97
2025-02-21T02:57:35.055Z - Status: in_progress - 93/97
2025-02-21T02:57:40.484Z - Status: in_progress - 93/97
2025-02-21T02:57:45.716Z - Status: in_progress - 93/97
2025-02-21T02:57:50.925Z - Status: in_progress - 93/97
2025-02-21T02:57:56.237Z - Status: in_progress - 93/97
2025-02-21T02:58:01.473Z - Status: in_progress - 93/97
2025-02-21T02:58:06.696Z - Status: in_progress - 93/97
2025-02-21T02:58:11.918Z - Status: in_progress - 93/97
2025-02-21T02:58:17.163Z - Status: in_progress - 93/97
2025-02-21T02:58:22.467Z - Status: in_progress - 93/97
2025-02-21T02:58:27.702Z - Status: in_progress - 93/97
2025-02-21T02:58:32.917Z - Status: in_progress - 93/97
2025-02-21T02:58:38.129Z - Status: in_progress - 93/97
2025-02-21T02:58:43.356Z - Status: in_progress - 93/97
2025-02-21T02:58:48.805Z - Status: in_progress - 93/97
2025-02-21T02:58:54.022Z - Status: in_progress - 96/97
2025-02-21T02:58:59.249Z - Status: in_progress - 96/97
2025-02-21T02:59:04.607Z - Status: in_progress - 96/97
2025-02-21T02:59:09.875Z - Status: in_progress - 96/97
2025-02-21T02:59:15.099Z - Status: in_progress - 96/97
2025-02-21T02:59:20.319Z - Status: in_progress - 96/97
2025-02-21T02:59:25.537Z - Status: in_progress - 96/97
2025-02-21T02:59:30.781Z - Status: in_progress - 96/97
2025-02-21T02:59:36.090Z - Status: in_progress - 96/97
2025-02-21T02:59:41.416Z - Status: in_progress - 96/97
2025-02-21T02:59:46.616Z - Status: in_progress - 96/97
2025-02-21T02:59:51.860Z - Status: in_progress - 96/97
2025-02-21T02:59:57.087Z - Status: in_progress - 96/97
2025-02-21T03:00:02.409Z - Status: in_progress - 96/97
2025-02-21T03:00:07.735Z - Status: in_progress - 96/97
2025-02-21T03:00:12.944Z - Status: in_progress - 96/97
2025-02-21T03:00:18.184Z - Status: in_progress - 96/97
2025-02-21T03:00:23.402Z - Status: in_progress - 96/97
2025-02-21T03:00:28.623Z - Status: in_progress - 96/97
2025-02-21T02:59:30.781Z - Status: in_progress - 96/97
2025-02-21T02:59:36.090Z - Status: in_progress - 96/97
2025-02-21T02:59:41.416Z - Status: in_progress - 96/97
2025-02-21T02:59:46.616Z - Status: in_progress - 96/97
2025-02-21T02:59:51.860Z - Status: in_progress - 96/97
2025-02-21T02:59:57.087Z - Status: in_progress - 96/97
2025-02-21T03:00:02.409Z - Status: in_progress - 96/97
2025-02-21T03:00:07.735Z - Status: in_progress - 96/97
2025-02-21T03:00:12.944Z - Status: in_progress - 96/97
2025-02-21T03:00:18.184Z - Status: in_progress - 96/97
2025-02-21T03:00:23.402Z - Status: in_progress - 96/97
2025-02-21T03:00:28.623Z - Status: in_progress - 96/97
2025-02-21T02:59:41.416Z - Status: in_progress - 96/97
2025-02-21T02:59:46.616Z - Status: in_progress - 96/97
2025-02-21T02:59:51.860Z - Status: in_progress - 96/97
2025-02-21T02:59:57.087Z - Status: in_progress - 96/97
2025-02-21T03:00:02.409Z - Status: in_progress - 96/97
2025-02-21T03:00:07.735Z - Status: in_progress - 96/97
2025-02-21T03:00:12.944Z - Status: in_progress - 96/97
2025-02-21T03:00:18.184Z - Status: in_progress - 96/97
2025-02-21T03:00:23.402Z - Status: in_progress - 96/97
2025-02-21T03:00:28.623Z - Status: in_progress - 96/97
2025-02-21T02:59:57.087Z - Status: in_progress - 96/97
2025-02-21T03:00:02.409Z - Status: in_progress - 96/97
2025-02-21T03:00:07.735Z - Status: in_progress - 96/97
2025-02-21T03:00:12.944Z - Status: in_progress - 96/97
2025-02-21T03:00:18.184Z - Status: in_progress - 96/97
2025-02-21T03:00:23.402Z - Status: in_progress - 96/97
2025-02-21T03:00:28.623Z - Status: in_progress - 96/97
2025-02-21T03:00:07.735Z - Status: in_progress - 96/97
2025-02-21T03:00:12.944Z - Status: in_progress - 96/97
2025-02-21T03:00:18.184Z - Status: in_progress - 96/97
2025-02-21T03:00:23.402Z - Status: in_progress - 96/97
2025-02-21T03:00:28.623Z - Status: in_progress - 96/97
2025-02-21T03:00:18.184Z - Status: in_progress - 96/97
2025-02-21T03:00:23.402Z - Status: in_progress - 96/97
2025-02-21T03:00:28.623Z - Status: in_progress - 96/97
2025-02-21T03:00:23.402Z - Status: in_progress - 96/97
2025-02-21T03:00:28.623Z - Status: in_progress - 96/97
2025-02-21T03:00:28.623Z - Status: in_progress - 96/97
2025-02-21T03:00:33.829Z - Status: in_progress - 96/97
2025-02-21T03:00:39.076Z - Status: in_progress - 96/97
2025-02-21T03:00:33.829Z - Status: in_progress - 96/97
2025-02-21T03:00:39.076Z - Status: in_progress - 96/97
2025-02-21T03:00:44.393Z - Status: in_progress - 96/97
2025-02-21T03:00:39.076Z - Status: in_progress - 96/97
2025-02-21T03:00:44.393Z - Status: in_progress - 96/97
2025-02-21T03:00:44.393Z - Status: in_progress - 96/97
2025-02-21T03:00:49.615Z - Status: in_progress - 96/97
2025-02-21T03:00:54.841Z - Status: in_progress - 96/97
2025-02-21T03:01:00.166Z - Status: in_progress - 96/97
2025-02-21T03:01:05.590Z - Status: in_progress - 96/97
2025-02-21T03:01:10.833Z - Status: in_progress - 96/97
2025-02-21T03:01:00.166Z - Status: in_progress - 96/97
2025-02-21T03:01:05.590Z - Status: in_progress - 96/97
2025-02-21T03:01:10.833Z - Status: in_progress - 96/97
2025-02-21T03:01:05.590Z - Status: in_progress - 96/97
2025-02-21T03:01:10.833Z - Status: in_progress - 96/97
2025-02-21T03:01:10.833Z - Status: in_progress - 96/97
2025-02-21T03:01:16.138Z - Status: in_progress - 96/97
2025-02-21T03:01:16.138Z - Status: in_progress - 96/97
2025-02-21T03:01:21.465Z - Status: in_progress - 96/97
2025-02-21T03:01:26.675Z - Status: in_progress - 96/97
2025-02-21T03:01:31.909Z - Status: in_progress - 96/97
2025-02-21T03:01:37.136Z - Status: in_progress - 96/97
2025-02-21T03:01:42.353Z - Status: in_progress - 96/97
2025-02-21T03:01:47.684Z - Status: in_progress - 96/97
2025-02-21T03:01:52.900Z - Status: in_progress - 96/97
2025-02-21T03:01:58.126Z - Status: in_progress - 96/97
2025-02-21T03:02:03.349Z - Status: in_progress - 96/97
2025-02-21T03:02:08.567Z - Status: in_progress - 96/97
2025-02-21T03:02:13.893Z - Status: in_progress - 96/97
2025-02-21T03:02:19.124Z - Status: in_progress - 96/97
2025-02-21T03:02:24.332Z - Status: in_progress - 96/97
2025-02-21T03:02:29.549Z - Status: in_progress - 96/97
2025-02-21T03:02:34.793Z - Status: in_progress - 96/97
2025-02-21T03:02:40.108Z - Status: in_progress - 96/97
2025-02-21T03:02:45.330Z - Status: in_progress - 96/97
2025-02-21T03:02:50.554Z - Status: in_progress - 96/97
2025-02-21T03:02:55.778Z - Status: in_progress - 96/97
2025-02-21T03:03:01.102Z - Status: in_progress - 96/97
2025-02-21T03:03:06.427Z - Status: in_progress - 96/97
2025-02-21T03:03:11.653Z - Status: in_progress - 96/97
2025-02-21T03:03:16.921Z - Status: in_progress - 96/97
2025-02-21T03:03:22.195Z - Status: in_progress - 96/97
2025-02-21T03:03:27.523Z - Status: in_progress - 96/97
2025-02-21T03:03:32.745Z - Status: in_progress - 96/97
2025-02-21T03:03:37.967Z - Status: in_progress - 96/97
2025-02-21T03:03:43.293Z - Status: in_progress - 96/97
2025-02-21T03:03:48.485Z - Status: in_progress - 96/97
2025-02-21T03:03:53.779Z - Status: in_progress - 96/97
2025-02-21T03:03:59.066Z - Status: in_progress - 96/97
2025-02-21T03:04:04.471Z - Status: in_progress - 96/97
2025-02-21T03:04:09.710Z - Status: in_progress - 96/97
2025-02-21T03:04:14.933Z - Status: in_progress - 96/97
2025-02-21T03:04:20.147Z - Status: in_progress - 96/97
2025-02-21T03:04:25.355Z - Status: in_progress - 96/97
2025-02-21T03:04:30.601Z - Status: in_progress - 96/97
2025-02-21T03:04:35.861Z - Status: in_progress - 96/97
2025-02-21T03:04:41.267Z - Status: in_progress - 96/97
2025-02-21T03:04:46.629Z - Status: in_progress - 96/97
2025-02-21T03:04:51.869Z - Status: in_progress - 96/97
2025-02-21T03:04:57.081Z - Status: in_progress - 96/97
2025-02-21T03:05:02.333Z - Status: in_progress - 96/97
2025-02-21T03:05:07.553Z - Status: in_progress - 96/97
2025-02-21T03:05:12.763Z - Status: in_progress - 96/97
2025-02-21T03:05:17.969Z - Status: in_progress - 96/97
2025-02-21T03:05:23.235Z - Status: in_progress - 96/97
2025-02-21T03:05:28.439Z - Status: in_progress - 96/97
2025-02-21T03:05:34.090Z - Status: in_progress - 96/97
2025-02-21T03:05:39.316Z - Status: in_progress - 96/97
2025-02-21T03:05:44.743Z - Status: in_progress - 96/97
2025-02-21T03:05:49.963Z - Status: in_progress - 96/97
2025-02-21T03:05:55.204Z - Status: in_progress - 96/97
2025-02-21T03:06:00.510Z - Status: in_progress - 96/97
2025-02-21T03:06:05.736Z - Status: in_progress - 96/97
2025-02-21T03:06:10.960Z - Status: in_progress - 96/97
2025-02-21T03:06:16.170Z - Status: in_progress - 96/97
2025-02-21T03:06:21.392Z - Status: in_progress - 96/97
2025-02-21T03:06:26.932Z - Status: in_progress - 96/97
2025-02-21T03:06:32.255Z - Status: in_progress - 96/97
2025-02-21T03:06:37.478Z - Status: in_progress - 96/97
2025-02-21T03:06:42.805Z - Status: in_progress - 96/97
2025-02-21T03:06:48.045Z - Status: in_progress - 96/97
2025-02-21T03:06:53.235Z - Status: in_progress - 96/97
2025-02-21T03:06:58.435Z - Status: in_progress - 96/97
2025-02-21T03:07:03.694Z - Status: in_progress - 96/97
2025-02-21T03:07:08.916Z - Status: in_progress - 96/97
2025-02-21T03:07:14.138Z - Status: in_progress - 96/97
2025-02-21T03:07:19.361Z - Status: in_progress - 96/97
2025-02-21T03:07:24.584Z - Status: in_progress - 96/97
2025-02-21T03:07:29.805Z - Status: in_progress - 96/97
2025-02-21T03:07:35.029Z - Status: in_progress - 96/97
2025-02-21T03:07:40.336Z - Status: in_progress - 96/97
2025-02-21T03:07:45.568Z - Status: in_progress - 96/97
2025-02-21T03:07:50.930Z - Status: in_progress - 96/97
2025-02-21T03:07:56.136Z - Status: in_progress - 96/97
2025-02-21T03:08:01.447Z - Status: in_progress - 96/97
2025-02-21T03:08:06.673Z - Status: in_progress - 96/97
2025-02-21T03:08:11.892Z - Status: in_progress - 96/97
2025-02-21T03:08:17.120Z - Status: in_progress - 96/97
2025-02-21T03:08:22.440Z - Status: in_progress - 96/97
2025-02-21T03:08:27.663Z - Status: in_progress - 96/97
2025-02-21T03:08:32.891Z - Status: in_progress - 96/97
2025-02-21T03:08:38.113Z - Status: in_progress - 96/97
2025-02-21T03:08:43.332Z - Status: in_progress - 96/97
2025-02-21T03:08:48.618Z - Status: in_progress - 96/97
2025-02-21T03:08:53.877Z - Status: in_progress - 96/97
2025-02-21T03:08:59.105Z - Status: in_progress - 96/97
2025-02-21T03:09:04.322Z - Status: in_progress - 96/97
2025-02-21T03:09:09.545Z - Status: in_progress - 96/97
2025-02-21T03:09:14.974Z - Status: in_progress - 96/97
2025-02-21T03:09:20.199Z - Status: in_progress - 96/97
2025-02-21T03:09:25.418Z - Status: in_progress - 96/97
2025-02-21T03:09:30.614Z - Status: in_progress - 96/97
2025-02-21T03:09:35.965Z - Status: in_progress - 96/97
2025-02-21T03:09:41.193Z - Status: in_progress - 96/97
"""

parse_log_to_csv(log_data, 'progress_log.csv')
