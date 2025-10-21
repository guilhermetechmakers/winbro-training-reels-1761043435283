import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TestComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Component</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Test Button</Button>
      </CardContent>
    </Card>
  );
}
