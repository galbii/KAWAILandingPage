'use client';

import { LocalBusinessJsonLd, EventJsonLd } from 'next-seo';

export function StructuredData() {
  return (
    <>
      <LocalBusinessJsonLd
        type="Store"
        id="https://www.kawai-piano-sale-houston.com"
        name="KAWAI Piano Sales Houston - SHSU Partnership Event"
        description="Exclusive KAWAI piano sale event in Houston featuring digital and acoustic pianos at special prices. Partnership with Sam Houston State University."
        url="https://www.kawai-piano-sale-houston.com"
        telephone="+1-713-XXX-XXXX"
        address={{
          streetAddress: "Sam Houston State University",
          addressLocality: "Houston",
          addressRegion: "TX",
          postalCode: "77340",
          addressCountry: "US",
        }}
        geo={{
          latitude: "30.7128",
          longitude: "-95.5527",
        }}
        images={[
          "/images/optimized/pianos/es120.webp",
          "/images/optimized/pianos/K-200_EP_styling_1200.webp",
          "/images/optimized/pianos/GL10_1200.webp",
        ]}
        sameAs={[
          "https://www.kawai-global.com",
          "https://www.shsu.edu",
        ]}
        openingHours={[
          {
            opens: "09:00",
            closes: "18:00",
            dayOfWeek: [
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            validFrom: "2025-09-11",
            validThrough: "2025-09-14",
          },
        ]}
        rating={{
          ratingValue: "4.9",
          ratingCount: "127",
        }}
        makesOffer={[
          {
            priceSpecification: {
              type: "UnitPriceSpecification",
              priceCurrency: "USD",
              price: "949-18995",
            },
            itemOffered: {
              name: "KAWAI Piano Sales",
              description: "Digital and acoustic pianos including upright and grand pianos with special Houston pricing.",
            },
          },
        ]}
        areaServed={[
          {
            geoMidpoint: {
              latitude: "29.7604",
              longitude: "-95.3698",
            },
            geoRadius: "50000", // 50km radius covering Greater Houston Area
          },
        ]}
      />
      
      <EventJsonLd
        name="KAWAI Piano Sale Event Houston"
        startDate="2025-09-11T09:00:00-05:00"
        endDate="2025-09-14T18:00:00-05:00"
        description="Exclusive KAWAI piano sale event in Houston featuring digital and acoustic pianos at special reduced prices. Partnership with Sam Houston State University offering savings up to $6,000."
        location={{
          name: "Sam Houston State University",
          address: {
            streetAddress: "1806 Ave J",
            addressLocality: "Huntsville",
            addressRegion: "TX",
            postalCode: "77340",
            addressCountry: "US",
          },
        }}
        url="https://www.kawai-piano-sale-houston.com"
        images={[
          "/images/optimized/pianos/es120.webp",
          "/images/optimized/pianos/K-200_EP_styling_1200.webp",
          "/images/optimized/pianos/GL10_1200.webp",
        ]}
        offers={[
          {
            price: "949",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: "https://www.kawai-piano-sale-houston.com",
            validFrom: "2025-09-11",
            validThrough: "2025-09-14",
          },
        ]}
        performer={{
          name: "KAWAI Piano Company",
          sameAs: "https://www.kawai-global.com",
        }}
        organizer={{
          name: "Sam Houston State University Music Department",
          sameAs: "https://www.shsu.edu",
        }}
        eventStatus="https://schema.org/EventScheduled"
        eventAttendanceMode="https://schema.org/OfflineEventAttendanceMode"
      />
    </>
  );
}