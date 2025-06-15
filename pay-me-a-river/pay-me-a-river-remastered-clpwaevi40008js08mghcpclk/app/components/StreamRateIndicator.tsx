import { Skeleton } from '@/components/ui/skeleton';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Stream } from '@/app/payments/CreatedStreamList';
import { Provider, Network } from 'aptos';
import { sleep } from '@/lib/utils';

/* 
  Finds the best unit to display the stream rate in by changing the bottom of the unit from seconds
  to minutes, hours, days, etc.
*/
function displayStreamRate(streamRatePerSecond: number) {
  if (streamRatePerSecond == 0) {
    return '0 APT / s';
  }

  if (Math.abs(streamRatePerSecond) >= 1) {
    return `${streamRatePerSecond.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    })} APT / s`;
  }

  streamRatePerSecond *= 60; // to minutes
  if (Math.abs(streamRatePerSecond) >= 1) {
    return `${streamRatePerSecond.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    })} APT / min`;
  }

  streamRatePerSecond *= 60; // to hours
  if (Math.abs(streamRatePerSecond) >= 1) {
    return `${streamRatePerSecond.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    })} APT / hr`;
  }

  streamRatePerSecond *= 24; // to days
  if (Math.abs(streamRatePerSecond) >= 1) {
    return `${streamRatePerSecond.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    })} APT / day`;
  }

  streamRatePerSecond *= 7; // to weeks
  if (Math.abs(streamRatePerSecond) >= 1) {
    return `${streamRatePerSecond.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    })} APT / week`;
  }

  streamRatePerSecond *= 4; // to months
  if (Math.abs(streamRatePerSecond) >= 1) {
    return `${streamRatePerSecond.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    })} APT / month`;
  }

  streamRatePerSecond *= 12; // to years

  return `${streamRatePerSecond.toLocaleString(undefined, {
    maximumFractionDigits: 3,
  })} APT / year`;
}

export default function StreamRateIndicator() {
  // wallet adapter state
  const { isLoading, account, connected, signAndSubmitTransaction } =
    useWallet();
  // stream rate state
  const [streamRate, setStreamRate] = useState(0);

  /* 
    Calculates and sets the stream rate
  */
  useEffect(() => {
    calculateStreamRate().then((streamRate) => {
      setStreamRate(streamRate);
    });
  });

  /*
    Calculates the stream rate by adding up all of the streams the user is receiving and subtracting
    all of the streams the user is sending.
  */
  const calculateStreamRate = async () => {
    const sender_streams = await getSenderStreams();
    const receiver_streams = await getReceiverStreams();
    console.log('senders:', sender_streams, 'receivers: ', receiver_streams);

    /* 
      TODO #1: Fetch the receiver and sender streams using getReceiverStreams and getSenderStreams. 
            Then, calculate the stream rate by calculating and adding up the rate of APT per second 
            for each receiver stream and subtracting the rate of APT per second for each sender stream.
            Return the stream rate.
  */
    if (sender_streams === undefined && receiver_streams === undefined) {
      // Handle the case where both sender and receiver streams are undefined
      // console.error('Error: Both sender and receiver streams are undefined.');
      return 0; // Return a default value or handle the error in a way that makes sense for your application.
    }

    /*const allActiveStreams = [
      ...(sender_streams?.active ?? []),
      ...(receiver_streams?.active ?? []),
    ];*/

    let aptPerSec = 0;

    if (sender_streams !== undefined) {
      const senderRate = sender_streams.active.reduce((acc, stream) => {
        const { amountApt, durationMilliseconds } = stream;
        const ratePerSec = amountApt / (durationMilliseconds / 1000);
        return acc + ratePerSec;
      }, 0);
      aptPerSec -= senderRate;
    }

    // If there are receiver streams, add their rates
    if (receiver_streams !== undefined) {
      const receiverRate = receiver_streams.active.reduce((acc, stream) => {
        const { amountApt, durationMilliseconds } = stream;
        const ratePerSec = amountApt / (durationMilliseconds / 1000);
        return acc + ratePerSec;
      }, 0);
      aptPerSec += receiverRate;
    }

    console.log(aptPerSec);

    return aptPerSec;
  };

  const getSenderStreams = async () => {
    /*
     TODO #2: Validate the account is defined before continuing. If not, return.
   */
    if (!account) {
      return;
    }
    /*
       TODO #3: Make a request to the view function `get_senders_streams` to retrieve the streams sent by 
             the user.
    */
    const provider = new Provider(Network.TESTNET);
    const payload = {
      function: `${process.env.MODULE_ADDRESS}::${process.env.MODULE_NAME}::get_senders_streams`,
      type_arguments: [],
      arguments: [account.address],
    };

    console.log('function payload: ', payload);
    let streams;
    const res = await provider.view(payload);
    console.log(res);
    const [
      receiver_addresses,
      start_timestamp,
      duration,
      stream_amounts,
      stream_ids,
    ] = res as [string[], string[], string[], string[], string[]];
    console.log(res);
    streams = receiver_addresses?.map((address, i) => {
      const startTimestampMilliseconds =
        parseInt(start_timestamp[i] ?? 0) * 1000;
      const durationMilliseconds = parseInt(duration[i] ?? 0) * 1000;
      const currentTimestampMilliseconds = Date.now();
      let status = 'unknown';

      if (startTimestampMilliseconds === 0) {
        status = 'pending';
      } else if (
        startTimestampMilliseconds + durationMilliseconds <
        currentTimestampMilliseconds
      ) {
        status = 'completed';
      } else {
        status = 'active';
      }
      return {
        recipient: address,
        sender: account.address as string,
        startTimestampMilliseconds, //: parseInt(start_timestamp[i] ?? 0) * 1000,
        durationMilliseconds, // : parseInt(duration[i] ?? 0) * 1000,
        amountApt: parseFloat(stream_amounts[i] ?? 0) / 100_000_000,
        streamId: parseInt(stream_ids[i]),
        status,
      };
    });
    /* 
       TODO #4: Parse the response from the view request and create the streams array using the given 
             data. Return the new streams array.
 
       HINT:
        - Remember to convert the amount to floating point number
    */
    console.log('SENDER STREAMS: ', streams);
    return {
      pending: streams.filter((stream) => stream.status === 'pending'),
      completed: streams.filter((stream) => stream.status === 'completed'),
      active: streams.filter((stream) => stream.status === 'active'),
    };
  };

  const getReceiverStreams = async () => {
    /*
      TODO #5: Validate the account is defined before continuing. If not, return.
    */
    if (!account) {
      return;
    }
    const provider = new Provider(Network.TESTNET);
    const payload = {
      function: `${process.env.MODULE_ADDRESS}::${process.env.MODULE_NAME}::get_receivers_streams`,
      type_arguments: [],
      arguments: [account.address],
    };

    /*
      TODO #6: Make a request to the view function `get_receivers_streams` to retrieve the streams sent by 
            the user.
    */
    let streams;
    const res = await provider.view(payload);
    console.log(res);
    const [
      sender_addresses,
      start_timestamp,
      duration,
      stream_amounts,
      stream_ids,
    ] = res as [string[], string[], string[], string[], string[]];
    console.log(res);
    streams = sender_addresses?.map((address, i) => {
      const startTimestampMilliseconds =
        parseInt(start_timestamp[i] ?? 0) * 1000;
      const durationMilliseconds = parseInt(duration[i] ?? 0) * 1000;
      const currentTimestampMilliseconds = Date.now();
      let status = 'unknown';

      if (startTimestampMilliseconds === 0) {
        status = 'pending';
      } else if (
        startTimestampMilliseconds + durationMilliseconds <
        currentTimestampMilliseconds
      ) {
        status = 'completed';
      } else {
        status = 'active';
      }
      return {
        recipient: account.address as string,
        sender: address,
        startTimestampMilliseconds, //: parseInt(start_timestamp[i] ?? 0) * 1000,
        durationMilliseconds, //: parseInt(duration[i] ?? 0) * 1000,
        amountApt: parseFloat(stream_amounts[i] ?? 0) / 100_000_000,
        streamId: parseInt(stream_ids[i]),
        status,
      };
    });
    console.log('RECEIVER STREAMS: ', streams);

    /* 
      TODO #7: Parse the response from the view request and create an object containing an array of 
            pending, completed, and active streams using the given data. Return the new object.

      HINT:
        - Remember to convert the amount to floating point number
        - Remember to convert the timestamps to milliseconds
        - Mark a stream as pending if the start timestamp is 0
        - Mark a stream as completed if the start timestamp + duration is less than the current time
        - Mark a stream as active if it is not pending or completed
    */
    return {
      pending: streams.filter((stream) => stream.status === 'pending'),
      completed: streams.filter((stream) => stream.status === 'completed'),
      active: streams.filter((stream) => stream.status === 'active'),
    };
  };

  if (!connected) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='bg-neutral-500 hover:bg-neutral-500 px-3'>
          <div className='flex flex-row gap-3 items-center'>
            <InfoCircledIcon className='h-4 w-4 text-neutral-100' />

            <span
              className={
                'font-matter ' +
                (streamRate > 0
                  ? 'text-green-400'
                  : streamRate < 0
                  ? 'text-red-400'
                  : '')
              }
            >
              {isLoading || !connected ? (
                <Skeleton className='h-4 w-24' />
              ) : (
                displayStreamRate(streamRate)
              )}
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your current stream rate</DialogTitle>
          <DialogDescription>
            This is the current rate at which you are streaming and being
            streamed APT. This rate is calculated by adding up all of the
            streams you are receiving and subtracting all of the streams you are
            sending.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
